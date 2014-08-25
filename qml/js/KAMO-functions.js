.import "Common.js" as JS

// // this function starts the async function rollercoaster that ends with LineID in selectedModelData
function makeNextDeparturesHttpRequest(stopId, startTime, routeCode, legModel) {
    var http = new XMLHttpRequest()

console.log(legModel)

    var soapData = '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '+
            'xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:seasam">'+
            '<soapenv:Header/>'+
            '<soapenv:Body>'+
            '<urn:getNextDepartures soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">'+
            '<String_1 xsi:type="xsd:string">' + stopId + '</String_1>'+
            '</urn:getNextDepartures>'+
            '</soapenv:Body>'+
            '</soapenv:Envelope>'


    // the actual url. Concatenating FTW
    var service = "http://hsl.trapeze.fi:80/interfaces/kamo"

    http.open("POST", service , true)


    // Now we're searching
    // httpQueryStatus = 1

    http.onreadystatechange = function() { // Call a function when the state changes.
        if (http.readyState == 4) {
            if (http.status == 200) {
                console.log("Kamo HTTP Success")

                //
                if (routeCode !== null) {
                    // create the xmlListModel
                    var kamoLineId = Qt.createComponent("../models/KamoLineId.qml");
                    kamoLineId.createObject(legModel, {startTime: startTime, routeCode: routeCode,
                                                legModel: legModel, xml: http.responseText});

                } else {
                    // kamoXml = http.responseXML
                    // this is crazy, but return the xml to someone maybe?
                }

            } else {
                console.log("Status: " + http.status + ", Status Text: " + http.statusText);
            }
        }
    }

    http.setRequestHeader("Content-type", "text/xml; charset=utf-8");
    http.send((soapData));
}


// this function starts the async function rollercoaster that ends with new realtime data inserted to model
function makePassingTimesHttpRequest(legModel) {
    var http = new XMLHttpRequest()



    var soapData = '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '+
            'xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:seasam">'+
            '<soapenv:Header/>'+
            '<soapenv:Body>'+
            '<urn:getPassingTimes soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">'+
            '<String_1 xsi:type="xsd:string">' + legModel.LineId + '</String_1>'+
            '</urn:getPassingTimes>'+
            '</soapenv:Body>'+
            '</soapenv:Envelope>'

    // the actual url. Concatenating FTW
    var service = "http://hsl.trapeze.fi:80/interfaces/kamo"

    http.open("POST", service , true)


    // Now we're searching
    httpQueryStatus = 1

    http.onreadystatechange = function() { // Call a function when the state changes.
        if (http.readyState == 4) {
            if (http.status == 200) {

                // create the xmlListModel
                var passingTimes = Qt.createComponent("../models/KamoPassingTimes.qml");
                passingTimes.createObject(legModel, {startTime: startTime, routeCode: routeCode,
                                            legModel: legModel, xml: http.responseText});
                kamoXml = http.responseText


            } else {

                console.log("Status: " + http.status + ", Status Text: " + http.statusText);
            }
        }
    }

    http.setRequestHeader("Content-type", "text/xml; charset=utf-8");
    http.send((soapData));
}


// update the real time data of all the selected legs
// parameter is the leg model object which will be changed
function mergeRealtimeData(legModel) {
    console.log(legModel)


    if (legModel.Type !== "walk" && legModel.Type !== "wait") {

        // find LineId if it's not defined
        if (typeof legModel.LineId === "undefined") {
            console.log("no LineId")
            console.log(legModel.StartName)
            makeNextDeparturesHttpRequest(legModel.StartCode, JS.kamoTime(legModel.StartTime), legModel.JORECode, legModel)
        }

        // get realtime data and merge it to the legs model
        else {
            console.log("leg " + selectedLegIndex + " LineId found: " + legModel.LineId)
            makePassingTimesHttpRequest(legModel)
        }
    }

}


