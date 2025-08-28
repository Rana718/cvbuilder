from typing import Dict, List, Optional
import json
import time
from config.redis import redis_client

class ContextManager:
    def __init__(self, max_context_per_doc: int = 6):
        self.max_context_per_doc = max_context_per_doc
    
    def _get_key(self, document_id: int) -> str:
        return f"context:{document_id}"
    
    async def add_message(self, document_id: int, role: str, content: str):
        message = {
            "role": role,
            "content": content,
            "timestamp": time.time()
        }
        
        key = self._get_key(document_id)
        messages = await self._get_messages_from_redis(key)
        
        messages.append(message)
        
        if len(messages) > self.max_context_per_doc:
            messages = messages[-self.max_context_per_doc:]
        
        await redis_client.set(key, json.dumps(messages), ex=180) 
    
    async def _get_messages_from_redis(self, key: str) -> List[Dict]:
        data = await redis_client.get(key)
        if data:
            return json.loads(data)
        return []
    
    async def get_context(self, document_id: int) -> List[Dict]:
        key = self._get_key(document_id)
        return await self._get_messages_from_redis(key)
    
    async def get_openai_messages(self, document_id: int) -> List[Dict]:
        context = await self.get_context(document_id)
        return [{"role": msg["role"], "content": msg["content"]} for msg in context]
    
    async def clear_context(self, document_id: int):
        key = self._get_key(document_id)
        await redis_client.delete(key)
    
    async def get_context_summary(self, document_id: int) -> str:
        context = await self.get_context(document_id)
        if not context:
            return "No context available"
        
        summary = f"Context for document {document_id} ({len(context)} messages):\n"
        for i, msg in enumerate(context):
            summary += f"{i+1}. {msg['role']}: {msg['content'][:100]}...\n"
        return summary

context_manager = ContextManager()
