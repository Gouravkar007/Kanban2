FROM python:3.12-slim

WORKDIR /app

RUN python -m pip install --upgrade pip
RUN python -m pip install uv

COPY backend/pyproject.toml ./backend/pyproject.toml
WORKDIR /app/backend
RUN uv sync

COPY backend .

EXPOSE 8080

CMD ["uv", "run", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]