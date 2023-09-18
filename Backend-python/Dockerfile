# Start with a base Python image
FROM python

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# The command to run the app
CMD ["python", "main.py"]
