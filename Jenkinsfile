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
        SSH_password = credentials('SSH-password')
        SSH_user = credentials('SSH_user')
        SSH_ip = credentials('SSH_ip')
        DOCKERHUB_CREDENTIALS = credentials('Dockerhub Credentials')
    }

    stages{
        stage("Checkout") {
            steps {
                script {
                    def gitVars = checkout scm
                    COMMIT_ID = gitVars.GIT_COMMIT
                    echo "The commit ID is ${COMMIT_ID}"
                }
            }
        }

        stage("SonarQube Analysis") {
            steps {
                script {
                    def scannerHome = tool 'SonarQube-Scanner'
                    withSonarQubeEnv('SonarQube-Server') {
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=Family-Backend"
                    }
                }
            }
        }

        stage("Build Docker Images") {
            steps {
                sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod.yml build"
            }
        }

        stage("Push Docker Images to Docker Hub") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'Dockerhub Credentials', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh "echo ${PASSWORD} | docker login --username ${USERNAME} --password-stdin"
                    sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod.yml push"
                    sh "tar -czvf k8s.tar.gz k8s/"
                    sh "sshpass -p ${SSH_password} scp k8s.tar.gz ${SSH_user}@${SSH_ip}:~/"
                    sh "sshpass -p ${SSH_password} scp docker-compose.prod.yml ${SSH_user}@${SSH_ip}:~/"
                    sh "rm -rf k8s.tar.gz"
                }
            }
        }

        stage("Pull Images from Docker Hub and Prepare Kubernetes Deployment") {
          steps {
            script {
                sshagent(['SSH-password']) {
                    sh "ssh ${SSH_user}@${SSH_ip} 'TAG=${COMMIT_ID} docker compose -f docker-compose.prod.yml pull'"
                    sh "ssh ${SSH_user}@${SSH_ip} 'tar -xzvf k8s.tar.gz'"
                    sh "ssh ${SSH_user}@${SSH_ip} \"find ./k8s -type f -name '*.yml' -exec sed -i 's/<TAG>/${COMMIT_ID}/g' {} \;\""
                    sh "ssh ${SSH_user}@${SSH_ip} 'kubectl delete -f ./k8s --ignore-not-found=true'"
                    sh "ssh ${SSH_user}@${SSH_ip} 'kubectl apply -f ./k8s'"
                    sh "ssh ${SSH_user}@${SSH_ip} 'kubectl rollout restart deployment/deployment-${COMMIT_ID}'"
                }
            }
          }
        }
    }
}
