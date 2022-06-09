pipeline {
    agent {label "city_game-dev" }
    
          stages {
            stage('Pull bitbucket') {
                steps {
                    sh "ls -la"     
                    }
                }
            stage("Build project") {
                steps {
                    sh "docker-compose down"     
                    sh "docker-compose up -d --build"                    
                    }
                }
            }   
            post { 
                always {
                    //send email
                    emailext body: '${JELLY_SCRIPT,template="html"}',
                    recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']], 
                    subject: "Jenkins Build ${currentBuild.currentResult}: ${env.JOB_NAME}",
                    to: 'aleh.ulaskin@sqilsoft.by , maksim.yakavenka@sqilsoft.by',
                    mimeType: 'text/html'
                    cleanWs()
                    }
            }  
}
