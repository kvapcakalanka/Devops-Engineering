pipeline {
    agent any
    environment {
        APP_SERVER = "54.145.100.121" // Terraform output: app_public_ip
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/kvapcakalanka/Devops-Engineering.git'
            }
        }
        stage('Build Backend Image') {
            steps {
                sh 'docker build -t pasan2001/devops-engineering:backend-v2 ./Backend'
            }
        }
        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t pasan2001/devops-engineering:frontend-v2 ./Frontend'
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                      echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                      docker push pasan2001/devops-engineering:backend-v2
                      docker push pasan2001/devops-engineering:frontend-v2
                    '''
                }
            }
        }
        stage('Deploy Frontend to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'app-server-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                    sh '''
                      ssh -i $SSH_KEY -o StrictHostKeyChecking=no ubuntu@${APP_SERVER} \
                        'sudo docker pull pasan2001/devops-engineering:frontend-v2 && \
                         sudo docker stop frontend || true && \
                         sudo docker rm frontend || true && \
                         sudo docker run -d --name frontend -p 80:3000 pasan2001/devops-engineering:frontend-v2'
                    '''
                }
            }
        }
    }
}
