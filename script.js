
    
    var invocation = new XMLHttpRequest();
    var url = 'http://aruner.net/resources/accesscontrolwithget/';
    var invocationHistoryText;
    
    function callOtherDomain(){
        if(invocation)
        {    
            invocation.open('GET', url, true);
            invocation.onreadystatechange = handler;
            invocation.send(); 
        }
        else
        {
            invocationHistoryText = "No Invocation TookPlace At All";
            var textNode = document.createTextNode(invocationHistoryText);
            var textDiv = document.getElementById("textDiv");
            textDiv.appendChild(textNode);
        }
        
    }
    function handler(evtXHR)
    {
        if (invocation.readyState == 4)
        {
                if (invocation.status == 200)
                {
                    var response = invocation.responseXML;
                    var invocationHistory = response.getElementsByTagName('invocationHistory').item(0).firstChild.data;
                    invocationHistoryText = document.createTextNode(invocationHistory);
                    var textDiv = document.getElementById("textDiv");
                    textDiv.appendChild(invocationHistoryText);
                    
                }
                else
                    alert("Invocation Errors Occured");
        }
        else
            dump("currently the application is at" + invocation.readyState);
    }
