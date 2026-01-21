pipeline {
    agent any
    
    environment {
        APP_SERVER = "54.145.100.121"
        DOCKER_IMAGE_BACKEND = "pasan2001/devops-engineering:backend-v2"
        DOCKER_IMAGE_FRONTEND = "pasan2001/devops-engineering:frontend-v2"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/kvapcakalanka/Devops-Engineering.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE_BACKEND} ./Backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE_FRONTEND} ./Frontend'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                      echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                      docker push ${DOCKER_IMAGE_BACKEND}
                      docker push ${DOCKER_IMAGE_FRONTEND}
                    '''
                }
            }
        }

        stage('Deploy Frontend to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'app-server-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                    sh '''
                      ssh -i $SSH_KEY -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@${APP_SERVER} \
                        'sudo docker pull ${DOCKER_IMAGE_FRONTEND} && \
                         sudo docker stop frontend || true && \
                         sudo docker rm frontend || true && \
                         sudo docker run -d --name frontend -p 80:3000 ${DOCKER_IMAGE_FRONTEND}'
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
            echo "App deployed at: http://${APP_SERVER}"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
