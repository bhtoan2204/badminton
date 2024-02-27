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
                  def scannerHome = tool 'SonarQube-Scanner';
                  withSonarQubeEnv('SonarQube-Server') {
                    sh "${tool("SonarQube-Scanner")}/bin/sonar-scanner -Dsonar.projectKey=Family-Backend"
                  }
                }
            }
        }

        stage("Build Docker Images") {
            steps {
                script {
                  sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod.yml build"
                }
            }
        }

        stage("Push Docker Images to Docker Hub") {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'Dockerhub Credentials', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh "echo ${PASSWORD} | docker login --username ${USERNAME} --password-stdin"
                        sh "TAG=${COMMIT_ID} docker compose -f docker-compose.prod.yml push"
                        sh "tar -czvf k8s.tar.gz k8s/"
                        sh "sshpass -p ${SSH_password} scp -r docker-compose.prod.yml ${SSH_user}@${SSH_ip}:~/"
                        sh "sshpass -p ${SSH_password} scp -r k8s.tar.gz ${SSH_user}@${SSH_ip}:~/"
                        sh "rm -rf k8s.tar.gz"
                    }
                }
            }
        }

        stage("Pull Images from Docker Hub") {
          steps {
            sh "sshpass -p ${SSH_password} ssh ${SSH_user}@${SSH_ip} 'TAG=${COMMIT_ID} docker compose -f docker-compose.prod.yml pull'"
            sh "sshpass -p ${SSH_password} ssh ${SSH_user}@${SSH_ip} 'tar -xzvf k8s.tar.gz'"
          }
        }

        stage("Deploy to Kubernetes") {
          steps {
            sh "sshpass -p ${SSH_password} ssh ${SSH_user}@${SSH_ip} 'TAG=${COMMIT_ID} tar -xzvf k8s.tar.gz'"
            sh "sshpass -p ${SSH_password} ssh ${SSH_user}@${SSH_ip} 'find ./k8s -type f -name \"*.yml\" -print0 | xargs -0 sed -i \"s/<TAG>/${COMMIT_ID}/g\"'"
            sh "sshpass -p ${SSH_password} ssh ${SSH_user}@${SSH_ip} 'kubectl apply -f ./k8s'"
            sh "sshpass -p ${SSH_password} ssh ${SSH_user}@${SSH_ip} 'for deployment in \$(kubectl get deployments --no-headers -o custom-columns=\":metadata.name\"); do kubectl rollout restart deployment/\$deployment; done'"
          }
        }
    }
}
