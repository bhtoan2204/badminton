pipeline {
    agent any

    tools {
        nodejs 'NodeJs Environment'
    }

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
    }

    environment {
        SSH_password = credentials('SSH_password')
        SSH_user = credentials('SSH_user')
        SSH_ip = credentials('SSH_ip')
        K8S_API_URL = credentials('K8S_API_URL')
        K8S_TOKEN = credentials('K8S_TOKEN')
    }

    stages {
        stage("Checkout") {
            steps {
                script {
                    def gitVars = checkout scm
                    COMMIT_ID = gitVars.GIT_COMMIT
                    echo "The commit ID is ${COMMIT_ID}"
                }
            }
        }

        stage("Build Docker Images") {
            steps {
                script {
                    sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod1.yml build"
                    sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod2.yml build"
                    sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod3.yml build"
                    sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod4.yml build"
                    sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod5.yml build"
                    sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod6.yml build"
                    sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod7.yml build"
                    sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod8.yml build"
                }
            }
        }

        stage("Push Docker Images to Docker Hub") {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'Dockerhub Credentials', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh "echo ${PASSWORD} | docker login --username ${USERNAME} --password-stdin"
                        sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod1.yml push"
                        sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod2.yml push"
                        sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod3.yml push"
                        sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod4.yml push"
                        sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod5.yml push"
                        sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod6.yml push"
                        sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod7.yml push"
                        sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod8.yml push"
                        // sh "tar -czvf k8s.tar.gz k8s/"
                        // sh "scp -o StrictHostKeyChecking=no -r k8s.tar.gz ${SSH_user}@${SSH_ip}:~/"
                        // sh "rm -rf k8s.tar.gz"
                    }
                }
            }
        }

        stage("Deploy to Kubernetes") {
            steps {
                script {
                    sh """
                        curl -X POST -H "Authorization: Bearer ${K8S_TOKEN}" \
                        -H "Content-Type: application/tar" \
                        --data-binary @k8s.tar.gz \
                        ${K8S_API_URL}/api/v1/namespaces/default/deployments
                    """
                    def response = sh(script: "curl -s -X GET -H 'Authorization: Bearer ${K8S_TOKEN}' ${K8S_API_URL}/apis/apps/v1/namespaces/default/deployments", returnStdout: true).trim()
                    def deployments = readJSON(text: response).items.collect { it.metadata.name }
                    deployments.each { deployment ->
                        sh """
                            curl -X POST -H 'Authorization: Bearer ${K8S_TOKEN}' \
                            -H 'Content-Type: application/json' \
                            ${K8S_API_URL}/apis/apps/v1/namespaces/default/deployments/${deployment}/restart
                        """
                    }
                }
            }
        }
    }
}
