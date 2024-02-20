pipeline {
    agent any

    tools {
      nodejs 'NodeJs Environment'
    }

    options {
      skipDefaultCheckout(true)
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
                  sh "docker compose build"
                }
            }
        }

        stage("Push Docker Images to Docker Hub") {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'Dockerhub Credentials', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh "echo ${PASSWORD} | docker login --username ${USERNAME} --password-stdin"
                        sh "docker compose -f docker-compose.prod.yml push"
                        sh "tar -czvf k8s.tar.gz k8s/"
                        sh "scp -r docker-compose.prod.yml banhhaotoan2002@104.199.191.41:~/"
                        sh "scp -r k8s.tar.gz banhhaotoan2002@104.199.191.41:~/"
                        sh "rm -rf k8s.tar.gz"
                    }
                }
            }
        }

        stage("Pull Images from Docker Hub") {
          steps {
            sh "ssh banhhaotoan2002@104.199.191.41 'docker compose -f docker-compose.prod.yml pull'"
            sh "ssh banhhaotoan2002@104.199.191.41 'tar -xzvf k8s.tar.gz'"
          }
        }

        stage("Deploy to Kubernetes") {
          steps {
            sh "ssh banhhaotoan2002@104.199.191.41 'kubectl apply -f ./k8s'"
          }
        }
    }
}
