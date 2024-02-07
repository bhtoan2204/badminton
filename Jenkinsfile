pipeline{
    agent any

    environment {
        SONARQUBE_SCANNER_HOME = tool 'SonarQube-Scanner'
        SONAR_PROJECT_ID = 'sonar.projectKey=Family-Backend'
    }

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
                  def scannerHome = tool 'sonarscan';
                  withSonarQubeEnv('SonarQube-Server') {
                    sh "${tool("sonarscan ")}/bin/sonar-scanner -Dsonar.projectKey=Family-Backend"
                  }
                }
            }
        }
    }
    post{
        always{
            echo "========always========"
        }
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}