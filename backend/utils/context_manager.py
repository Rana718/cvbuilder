# from typing import Dict, List, Optional
# import json
# import time
# import asyncio
# from config.redis import redis_client

# class ContextManager:
#     def __init__(self, max_context_per_doc: int = 6):
#         self.max_context_per_doc = max_context_per_doc
#         self._message_cache = {}  # Simple in-memory cache for faster access
    
#     def _get_key(self, document_id: int) -> str:
#         return f"context:{document_id}"
    
#     async def add_message(self, document_id: int, role: str, content: str):
#         message = {
#             "role": role,
#             "content": content,
#             "timestamp": time.time()
#         }
        
#         key = self._get_key(document_id)
        
#         # Update local cache
#         if key not in self._message_cache:
#             self._message_cache[key] = []
        
#         self._message_cache[key].append(message)
        
#         # Keep only the latest messages
#         if len(self._message_cache[key]) > self.max_context_per_doc:
#             self._message_cache[key] = self._message_cache[key][-self.max_context_per_doc:]
        
#         # Save to Redis if available (non-blocking)
#         if redis_client:
#             try:
#                 await asyncio.wait_for(
#                     redis_client.set(key, json.dumps(self._message_cache[key]), ex=300),
#                     timeout=1.0  # 1 second timeout
#                 )
#             except (asyncio.TimeoutError, Exception):
#                 # If Redis fails, continue with cache only
#                 pass
    
#     async def _get_messages_from_redis(self, key: str) -> List[Dict]:
#         if not redis_client:
#             return self._message_cache.get(key, [])
        
#         try:
#             data = await asyncio.wait_for(redis_client.get(key), timeout=1.0)
#             if data:
#                 messages = json.loads(data)
#                 # Update cache
#                 self._message_cache[key] = messages
#                 return messages
#         except (asyncio.TimeoutError, Exception):
#             # Fallback to cache if Redis fails
#             pass
        
#         return self._message_cache.get(key, [])
    
#     async def get_context(self, document_id: int) -> List[Dict]:
#         key = self._get_key(document_id)
        
#         # Try cache first for speed
#         if key in self._message_cache and self._message_cache[key]:
#             return self._message_cache[key]
        
#         # Fallback to Redis
#         return await self._get_messages_from_redis(key)
    
#     async def get_openai_messages(self, document_id: int) -> List[Dict]:
#         context = await self.get_context(document_id)
#         return [{"role": msg["role"], "content": msg["content"]} for msg in context]
    
#     async def clear_context(self, document_id: int):
#         key = self._get_key(document_id)
        
#         # Clear from cache
#         if key in self._message_cache:
#             del self._message_cache[key]
        
#         # Clear from Redis if available
#         if redis_client:
#             try:
#                 await asyncio.wait_for(redis_client.delete(key), timeout=1.0)
#             except (asyncio.TimeoutError, Exception):
#                 pass
    
#     async def get_context_summary(self, document_id: int) -> str:
#         context = await self.get_context(document_id)
#         if not context:
#             return "No context available"
        
#         summary = f"Context for document {document_id} ({len(context)} messages):\n"
#         for i, msg in enumerate(context):
#             summary += f"{i+1}. {msg['role']}: {msg['content'][:100]}...\n"
#         return summary

# context_manager = ContextManager()
