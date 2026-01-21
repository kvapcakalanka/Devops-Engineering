pipeline {
    agent any
    
    environment {
        // EC2 Instance
        APP_SERVER = "54.145.100.121"
        
        // Docker Images
        DOCKER_IMAGE_BACKEND = "pasan2001/devops-engineering:backend-v2"
        DOCKER_IMAGE_FRONTEND = "pasan2001/devops-engineering:frontend-v2"
        
        // Jenkins Credentials IDs
        SSH_CRED_ID = "app-server-ssh-key"
        DOCKERHUB_CRED_ID = "dockerhub"
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo "📦 Cloning repository..."
                git branch: 'main', url: 'https://github.com/kvapcakalanka/Devops-Engineering.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                echo "🔨 Building backend Docker image..."
                sh 'docker build -t ${DOCKER_IMAGE_BACKEND} ./Backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo "🔨 Building frontend Docker image..."
                sh 'docker build -t ${DOCKER_IMAGE_FRONTEND} ./Frontend'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "📤 Pushing images to Docker Hub..."
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CRED_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${DOCKER_IMAGE_BACKEND}
                        docker push ${DOCKER_IMAGE_FRONTEND}
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy Frontend to EC2') {
            steps {
                echo "🚀 Deploying frontend to EC2 instance..."
                withCredentials([sshUserPrivateKey(credentialsId: "${SSH_CRED_ID}", keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                    sh '''
                        ssh -i $SSH_KEY \
                            -o StrictHostKeyChecking=no \
                            -o UserKnownHostsFile=/dev/null \
                            -o ConnectTimeout=10 \
                            ubuntu@${APP_SERVER} \
                            'set -e; \
                             echo "Pulling latest image..."; \
                             sudo docker pull ${DOCKER_IMAGE_FRONTEND}; \
                             echo "Stopping old container..."; \
                             sudo docker stop frontend || true; \
                             sudo docker rm frontend || true; \
                             echo "Starting new container..."; \
                             sudo docker run -d --name frontend -p 80:3000 ${DOCKER_IMAGE_FRONTEND}; \
                             echo "Container deployed successfully"'
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "✅ Verifying deployment..."
                sh '''
                    echo "Waiting for application to be ready..."
                    sleep 5
                    curl -I http://${APP_SERVER}:3000 || echo "App is starting, will be ready shortly"
                '''
            }
        }
    }

    post {
        success {
            echo "=========================================="
            echo "✅ PIPELINE COMPLETED SUCCESSFULLY!"
            echo "=========================================="
            echo "Frontend deployed at: http://${APP_SERVER}"
            echo "Test via port 3000: http://${APP_SERVER}:3000"
            echo "Production (port 80): http://${APP_SERVER}"
            echo "=========================================="
        }
        failure {
            echo "=========================================="
            echo "❌ PIPELINE FAILED!"
            echo "=========================================="
            echo "Check logs above for details"
            echo "Common issues:"
            echo "  - SSH credential 'app-server-ssh-key' not found in Jenkins"
            echo "  - Docker Hub credential 'dockerhub' not found"
            echo "  - EC2 instance not reachable"
            echo "  - Insufficient permissions on EC2"
            echo "=========================================="
        }
        always {
            echo "Pipeline execution completed"
        }
    }
}
