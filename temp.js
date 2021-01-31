var ourRequest  = new XMLHttpRequest();
ourRequest.open('POST','http://127.0.0.1:5000',true);
function test(){
    var res = document.getElementsByClassName("form-group").value;
    //res.innerHTML = this.responseText;
    console.log(res);
};