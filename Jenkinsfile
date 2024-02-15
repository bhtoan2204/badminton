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

        stage("Build and Tag Docker Images") {
            steps {
                script {
                  sh "docker compose build --no-cache"
                  sh "docker compose images | tail -n +3 | awk '{print \$1,\$2,\$3}' | while read service image tag; do docker tag \$image:\$tag \$image:${COMMIT_ID}; done"
                }
            }
        }

        stage("Push Docker Images to Docker Hub") {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'Dockerhub Credentials', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh "echo ${PASSWORD} | docker login --username ${USERNAME} --password-stdin"
                        sh "docker compose images | tail -n +3 | awk '{print \$1,\$2,\$3}' | while read service image tag; do docker push \$image:${COMMIT_ID}; done"
                    }
                }
            }
        }

        stage("Pull Images from Docker Hub") {
          steps {
                sh "echo Pull"
          }
        }

        stage("Deploy to Kubernetes") {
          steps {
                sh "echo Deploy"
          }
        }
    }
}
