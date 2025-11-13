pipeline {
    agent any

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
    }
}
