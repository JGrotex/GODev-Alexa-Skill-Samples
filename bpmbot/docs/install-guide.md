# TIBCO Casemanagement Demo
## Install Guide
Step by Step Guide to create your own copy of the Skill within your Amazon Developer Account.

![Icon](../../images/TIBCO-Alexa.png?raw=true "Alexa BPM Skill")

### Lambda Function
URL: https://console.aws.amazon.com/lambda/home

#### Step 1.
- select AWS location 'us-east-1' (only this is currently Supported to host Alexa triggerd Functions, <i>maybe outdated Info</i>)
- create your Lambda Function, 'create function'
- select Author from scratch
- enter a function Name: e.g. 'bpmbot'
- create a new Role or select the existing one
- select 'create function'
- Add trigger, select 'Alexa Skills Kit' and then add

#### Step 2.
so far so good, but now we need to get the Source including all needed node-modules on Lambda.
here you need a full AWS CLI installed and configured for your Amazon AWS Account.
This can be installed e.g. on windows by just using one [MSI](https://docs.aws.amazon.com/cli/latest/userguide/awscli-install-windows.html).
- configure your Environment using: aws configure
- upload bpmbot.zip to your Lambda function: (The Zip is in the ZIP Folder, here on GitHub)
  aws lambda update-function-code --function-name bpmbot --zip-file fileb://C:/GoDev/src/GODev-Alexa-Skill-Samples/bpmbot/zip/bpmbot.zip
- the command should return some JSON Summary Feedback
- reopen your Lambda Function in AWS, and it should look like this:

![Lambda Source View](../../images/lambda-function-source.png?raw=true "BPM Bot on Lambda Source View")

- configure your APP_ID here later, because of Security (but this is Optional)
- Configure the Lambda Environment Variables (below the Function Source) as follows

![Lambda Environment Variables](../../images/lambda-bpm-env.png?raw=true "BPM Bot Environment Variables")

- Use your ActivMatrix BPM Server REST URL, here the Skill is connected to a Server Instance running on Amazon EC2.
- under 'Basic Settings' set the timeout from 3sec. to 7sec. as the Login can take a bit longer.  
- on the Top of the Page you find the unique <b>ARN</b> of you Lambda Function, copy it as you need to enter it later into the Alexa Skill Configuration.

### Alexa SKILL
URL: https://developer.amazon.com/home.html 

#### Step 3.
new the Alexa Skill have to be configured to listen and call your Lambda Function

<b>Skill Information Tab</b>
- select your prefered Language, you can add others later
- create a new custom Skill, Name: TIBCO BPM Bot 2
- more Important, define your Invovation Name: e.g. 'tibco casemanagement demo'
- click on 'Save' and then 'Next' 

<i>Note: the Language for Alexa is currently tighly connected to the Amazon User Profile Language, you can not test other Languages without changing this Setting.</i>

<b>Interaction Model Tab</b>
- select Model Builder
- select Code Editor Tab
- copy the Intent JSON File content of your selected Language. (they are in the Intents Folder here on GitHub)
- click on 'Apply Changes'
- click 'Save Model'
- then click 'Build Model' ... wait until the Build is done!

<b>Configuration Tab</b>
- click on Configuration
- select Service Endpoint Type: 'AWS Lanbda ARN'
- copy your Lambda Function ARN into the field 'Default': e.g. arn:aws:lambda:us-east-1:<i>something</i>:function:bpmbot
- for 'Account Linking' select 'no'
- click on 'Save' and then 'Next' 

<b>Test Tab</b>
- enable Testing
- now you can perform some basic testing using Service Simulator, or just proceed to Step 4.

<i>Note: All Activities here could change slightly, as this Area is under heavy development at Amazon.</i>

#### Step 4.
try your newly created Skill on any Alexa Device, e.g. your Echo, or Sonos One
or here on [EchioSim.io](https://echosim.io/) 

use e.g. 'start tibco casemanagement demo' followed by 'what functions can I call'

<i>Note: The Skill will tell you if your TIBCO ActiveMatrix BPM Server is up and running or offline.</i>
