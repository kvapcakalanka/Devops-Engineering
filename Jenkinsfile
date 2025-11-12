pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/commander-maker/Devops_Engineering.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t deamon2002/devops-engineering:backend-v2 ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t deamon2002/devops-engineering:frontend-v2 ./frontend'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                      echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                      docker push deamon2002/devops-engineering:backend-v2
                      docker push deamon2002/devops-engineering:frontend-v2
                    '''
                }
            }
        }
    }
}
