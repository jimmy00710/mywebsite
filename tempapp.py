from flask import Flask,request,render_template,url_for,send_from_directory
from flask import jsonify
from flask_cors import CORS
from flask import request
from flask import json
"""
app=Flask(__name__)



@app.route('/')
def my_form():
    return render_template('./portfoliotemp.html')


@app.route('/readmore.html')
def readmore_html():
    return render_template('./readmore.html')

@app.route('/',methods=['GET','POST'])
def my_form_post():
    name=request.form['Name']
    email = request.form['Email']
    message = request.form['Message']
    name = name.upper()
    email = email.upper()
    message = message.upper()
    with open('./file.txt','wb' ) as f:
        f.write(name,email,message)
    return None

if __name__ == '__main__':
    app.debug = True
    app.run()
"""

app = Flask(__name__)
cors  = CORS(app)





@app.route('/contact',methods=['POST'])
def hello_world():
    #val = request.is_json()
    #print(val)
    #content = request.json
    content = request.get_data(cache=False)
    print(content)
    print(type(content))

    content = content.decode('utf-8')
    #name = content['username']
    #name = content['username']
    print(content)
    print(type(content))
    #email = content['useremail']
    content = content.split('&') # Its a list
    for con in content:
        con = con.replace('=',':')
    print(content)
    #print(name,email)
    #print(jsonify(all))
    #return json.dumps({'name':name,'email':email})
    #return jsonify.dumps({'content':content})
    return json.dumps({'status':content}) 


if __name__ == '__main__':
    app.run()
