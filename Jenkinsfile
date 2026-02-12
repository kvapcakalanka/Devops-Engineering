pipeline {
    agent any
    environment {
        APP_SERVER = "98.93.104.219" // Current EC2 public IP
        EC2_USER = "ec2-user" // Use ubuntu for Ubuntu AMI
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
                sh 'docker build -t ${DOCKER_REGISTRY}:frontend-v2 ./app/frontend'
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
        stage('Deploy to EC2 with Docker Compose') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'app-server-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                                            ssh -i $SSH_KEY -o StrictHostKeyChecking=no ${EC2_USER}@${APP_SERVER} << 'EOF'
                                                set -e
                                                APP_DIR="$HOME/app/Devops-Engineering-main"

                                                if ! command -v git >/dev/null 2>&1; then
                                                    if command -v yum >/dev/null 2>&1; then
                                                        sudo yum install -y git
                                                    elif command -v apt-get >/dev/null 2>&1; then
                                                        sudo apt-get update -y
                                                        sudo apt-get install -y git
                                                    fi
                                                fi

                                                if [ ! -d "$APP_DIR/.git" ]; then
                                                    mkdir -p "$HOME/app"
                                                      cd "$HOME/app"
                                                      git clone https://github.com/kvapcakalanka/Devops-Engineering.git Devops-Engineering-main
                                                fi

                                                cd "$APP_DIR"
                                                git pull || true

                                                if ! docker compose version >/dev/null 2>&1; then
                                                    if command -v yum >/dev/null 2>&1; then
                                                        sudo yum install -y docker-compose-plugin
                                                    elif command -v apt-get >/dev/null 2>&1; then
                                                        sudo apt-get update -y
                                                        sudo apt-get install -y docker-compose-plugin
                                                    fi
                                                fi

                                                sudo docker compose pull
                                                sudo docker compose up -d
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