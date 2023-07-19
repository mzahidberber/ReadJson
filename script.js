
function writeJson(url, tag) {
    readJsonFile(url).then(function (json) {
        var lines = json.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var spaceNumber = line.length - line.trimLeft().length;
            var jsonLine = addJsonLine(tag);

            if (line.trim() == "[" || line.trim() == "0" || line.trim() == "]" || line.trim() == "{" || line.trim() == "}" || line.trim() == "}," || line.trim() == "],") {
                addSpaceSpan(spaceNumber, jsonLine);
                addOperatorSpan(line, jsonLine)
            }
            else {
                addSpaceSpan(spaceNumber, jsonLine);
                var elements = line.split(":");
                addKeySpan(elements[0], jsonLine);
                addOperatorSpan(":", jsonLine);
                if (elements[1].trim() == "{" || elements[1].trim()=="[") {
                    addOperatorSpan(elements[1], jsonLine)
                } else {
                    addValueSpan(elements[1], jsonLine);
                    addOperatorSpan(",", jsonLine)
                }
            }
        }
    }).catch(function (error) { console.error(error); });

}



function readJsonFile(url) {
    return new Promise(function (resolve, reject) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", url, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200) {
                    var json = JSON.stringify(JSON.parse(rawFile.responseText), null, 2);
                    resolve(json);
                } else {
                    reject(new Error(rawFile.status));
                }
            }
        };
        rawFile.send();
    });
}

function addJsonLine(span) {
    var jl = document.createElement('span');
    jl.className = 'jsonLine';
    span.appendChild(jl)
    return jl;
}

function addValueSpan(value, span) {
    var s = document.createElement('span');
    s.className = 'jsonValue';
    var v = value.split(",");
    s.textContent = v[0];
    span.appendChild(s)
}

function addKeySpan(key, span) {
    var s = document.createElement('span');
    s.className = 'jsonKey';
    s.textContent = key;
    span.appendChild(s)
}

function addOperatorSpan(operator, span) {
    var s = document.createElement('span');
    s.className = 'jsonBrackets';
    s.textContent = operator;
    span.appendChild(s)
}

function addSpaceSpan(space, span) {
    var s = document.createElement('span');
    s.className = 'jsonSpace';
    s.style.display = 'inline-block';
    s.style.width = `${space / 2}em`;
    span.appendChild(s)
}

var btn=document.getElementById("copyBtnBoxBody")
btn.addEventListener("click",()=>{
    readJsonFile("test.json").then(function(json){
        setTimeout(async()=>await window.navigator.clipboard.writeText(json), 100)
    })
})

var tag = document.getElementById("json");
writeJson("test.json",tag)
