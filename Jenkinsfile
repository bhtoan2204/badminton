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

        stage("Build Docker Images") {
            steps {
                script {
                  sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod1.yml build"
                  sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod2.yml build"
                  sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod3.yml build"
                  sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod4.yml build"
                  sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod5.yml build"
                  sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod6.yml build"
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
                        sh "tar -czvf k8s.tar.gz k8s/"
                        sh "sshpass -p ${SSH_password} scp -o StrictHostKeyChecking=no -r k8s.tar.gz ${SSH_user}@${SSH_ip}:~/"
                        sh "rm -rf k8s.tar.gz"
                    }
                }
            }
        }

        stage("Deploy to Kubernetes") {
            steps {
                withCredentials([
                    string(credentialsId: 'SSH_password', variable: 'SSH_PASS'),
                    string(credentialsId: 'SSH_user', variable: 'SSH_USER'),
                    string(credentialsId: 'SSH_ip', variable: 'SSH_IP')
                ]) {
                    sh """
                        sshpass -p $SSH_PASS ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_IP \
                        'TAG=${COMMIT_ID} tar -xzvf k8s.tar.gz'
                    """
                    sh """
                        sshpass -p $SSH_PASS ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_IP \
                        'find ./k8s -type f -name "*.yml" -print0 | xargs -0 sed -i "s/<TAG>/${COMMIT_ID}/g"'
                    """
                    sh """
                        sshpass -p $SSH_PASS ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_IP \
                        'kubectl apply -f ./k8s'
                    """
                    sh """
                        sshpass -p $SSH_PASS ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_IP \
                        'DEPLOYMENTS=\$(kubectl get deployments --no-headers -o custom-columns=\":metadata.name\") \
                        if [ -z "\$DEPLOYMENTS" ]; then \
                            echo "First deployment, skipping rollout restart"; \
                        else \
                            for deployment in \$DEPLOYMENTS; do \
                                if [[ "\$deployment" != "rabbitmq-deployment" && "\$deployment" != "redis-deployment" ]]; then \
                                    kubectl rollout restart deployment/\$deployment; \
                                fi; \
                            done \
                        fi'
                    """
                }
            }
        }
    }
}
