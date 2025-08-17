
echo "Building complete QuickCourt application..."


echo "Cleaning up existing containers..."
docker-compose down --remove-orphans


echo "Removing old images..."
docker system prune -f


echo "Building and starting services..."
docker-compose up --build -d

echo "Waiting for services to start..."
sleep 30

echo "Build completed!"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost/api"
echo "Swagger UI: http://localhost/swagger-ui/"
echo "Health Check: http://localhost/actuator/health"
echo "Alternative Frontend Port: http://localhost:3000"


echo "Checking service status..."
docker-compose ps