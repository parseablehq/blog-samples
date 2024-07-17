import streamlit as st
import PyPDF2
import os
import logging
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI
import requests
import json
from datetime import datetime
import pickle

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Parseable configuration
PARSEABLE_URL = "https://demo.parseable.com/api/v1/logstream"
PARSEABLE_STREAM = "ragbot"

# OpenAI API key (replace with your actual key)
os.environ["OPENAI_API_KEY"] = "<open_ai_key>"

# File to store chat history
CHAT_HISTORY_FILE = "chat_history.pkl"

def send_log_to_parseable(log_data):
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic YWRtaW46YWRtaW4=" # Basic auth with username and password
    }
    try:
        response = requests.post(f"{PARSEABLE_URL}/{PARSEABLE_STREAM}", headers=headers, json=log_data)
        response.raise_for_status()
        logger.info("Log sent to Parseable successfully")
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to send log to Parseable: {e}")

def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def create_vector_store(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(text)
    
    embeddings = OpenAIEmbeddings()
    vector_store = FAISS.from_texts(chunks, embeddings)
    
    return vector_store

def create_conversation_chain(vector_store):
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vector_store.as_retriever(),
        return_source_documents=True
    )
    return conversation_chain

def load_chat_history():
    if os.path.exists(CHAT_HISTORY_FILE):
        with open(CHAT_HISTORY_FILE, 'rb') as f:
            return pickle.load(f)
    return []

def save_chat_history(chat_history):
    with open(CHAT_HISTORY_FILE, 'wb') as f:
        pickle.dump(chat_history, f)

def main():
    st.title("RAG Conversation Bot with PDF Upload")
    
    st.write("Note: Chat history is stored locally on your device.")
    
    uploaded_file = st.file_uploader("Choose a PDF file", type="pdf")
    
    if uploaded_file is not None:
        text = extract_text_from_pdf(uploaded_file)
        vector_store = create_vector_store(text)
        conversation_chain = create_conversation_chain(vector_store)
        
        st.success("PDF uploaded and processed successfully!")
        
        chat_history = load_chat_history()
        
        for message in chat_history:
            st.write(f"{'User' if message['is_user'] else 'Bot'}: {message['text']}")
        
        user_question = st.text_input("Ask a question about the PDF:")
        
        if user_question:
            start_time = datetime.now()
            result = conversation_chain({"question": user_question, "chat_history": [(msg['text'], '') for msg in chat_history if not msg['is_user']]})
            end_time = datetime.now()
            
            answer = result["answer"]
            st.write("Bot:", answer)
            
            chat_history.append({"is_user": True, "text": user_question})
            chat_history.append({"is_user": False, "text": answer})
            save_chat_history(chat_history)
            
            # Prepare log data
            log_data = {
                "timestamp": datetime.now().isoformat(),
                "pdf_name": uploaded_file.name,
                "question": user_question,
                "answer": answer,
                "processing_time_ms": (end_time - start_time).total_seconds() * 1000
            }
            
            # Send log to Parseable
            send_log_to_parseable(log_data)

if __name__ == "__main__":
    main()