# Stage 1: Development
FROM python:3.12-slim AS development

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY apps/utilities/requirements.txt ./
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY apps/utilities/ .

# Set working directory to the Django project root
WORKDIR /usr/src/app/apps/utilities

# # Collect static files (assuming you have a collectstatic command)
# RUN python manage.py collectstatic --noinput

# # Stage 2: Production
# FROM python:3.12-slim AS production

# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# # Set working directory
# WORKDIR /usr/src/app

# # Install dependencies
# COPY apps/utilities/requirements.txt ./
# RUN pip install --upgrade pip
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy only necessary files from the development stage
# COPY --from=development /usr/src/app /usr/src/app

# # Set working directory to the Django project root
# WORKDIR /usr/src/app/apps/utilities

# # Create a non-root user and change ownership of the application files
# RUN adduser --disabled-password nonroot && chown -R nonroot:nonroot /usr/src/app

# # Change to non-root user
# USER nonroot

# # Expose the port the app runs on
# EXPOSE 8000

# # Start the application
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "utilities.wsgi:application"]
