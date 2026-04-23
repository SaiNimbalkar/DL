pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t event-registration-app .'
            }
        }

        stage('Stop Old Container') {
            steps {
                bat 'docker stop event-app || exit 0'
                bat 'docker rm event-app || exit 0'
            }
        }

        stage('Run Docker Container') {
            steps {
                bat 'docker run -d -p 5000:5000 --name event-app event-registration-app'
            }
        }

    }
}