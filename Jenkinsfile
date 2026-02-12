pipeline {
    agent any
    environment {
        APP_SERVER = "54.145.100.121" // Terraform output: app_public_ip
        DOCKER_REGISTRY = "pasan2001/devops-engineering"
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/kvapcakalanka/Devops-Engineering.git'
            }
        }
        stage('Build Backend Image') {
            steps {
                sh 'docker build -t ${DOCKER_REGISTRY}:backend-v2 ./Backend'
            }
        }
        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t ${DOCKER_REGISTRY}:frontend-v2 ./Frontend'
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                      echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                      docker push ${DOCKER_REGISTRY}:backend-v2
                      docker push ${DOCKER_REGISTRY}:frontend-v2
                    '''
                }
            }
        }
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'app-server-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                      ssh -i $SSH_KEY -o StrictHostKeyChecking=no ubuntu@${APP_SERVER} << 'EOF'
                        # Pull latest image
                        sudo docker pull ${DOCKER_REGISTRY}:frontend-v2
                        
                        # Stop and remove old container
                        sudo docker stop frontend 2>/dev/null || true
                        sudo docker rm frontend 2>/dev/null || true
                        
                        # Run new container
                        sudo docker run -d \
                          --name frontend \
                          --restart unless-stopped \
                          -p 80:80 \
                          ${DOCKER_REGISTRY}:frontend-v2
                        
                        # Verify deployment
                        sudo docker ps | grep frontend
EOF
                    '''
                }
            }
        }
                stage('Deploy to EC2 with Docker Compose') {
                        steps {
                                withCredentials([sshUserPrivateKey(credentialsId: 'app-server-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                                        sh '''
                                            ssh -i $SSH_KEY -o StrictHostKeyChecking=no ubuntu@${APP_SERVER} << 'EOF'
                                                cd ~/app/Devops-Engineering-main/Devops-Engineering-main
                                                git pull || true
                                                sudo docker-compose pull
                                                sudo docker-compose up -d
                                                sudo docker system prune -f
                                                sudo docker ps
EOF
                                        '''
                                }
                        }
                }
    }
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo "🚀 Frontend deployed to http://${APP_SERVER}"
        }
        failure {
            echo '❌ Pipeline failed! Check the logs above.'
        }
        always {
            sh 'docker logout || true'
        }
    }
}