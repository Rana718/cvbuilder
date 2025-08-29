# Build 
FROM python:3.11-slim AS builder
RUN pip install --no-cache-dir uv
WORKDIR /app

COPY pyproject.toml uv.lock* ./
RUN uv pip install --system --no-cache --target /deps -r pyproject.toml

COPY . .

# Final minimal runtime image
FROM python:3.11-slim

WORKDIR /app
COPY --from=builder /deps /usr/local/lib/python3.11/site-packages
COPY --from=builder /app /app

EXPOSE 8000
CMD ["python3", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
