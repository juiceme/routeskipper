import QtQuick 2.0
import Sailfish.Silica 1.0
import "../elements" as Elements
import "../js/Common.js" as JS

Row {
    id: lineRow
    property string startName
    property string startTime
    property string endTime

    property color lineColor



    width: (parent !== null ? parent.width : 0)
    spacing: 10


    // Starting place and time
    Label {
        id: fromPart
        width: 60
        font.pixelSize: Theme.fontSizeSmall
        text:  JS.prettyTime(startTime)
        color: lineColor
        truncationMode: TruncationMode.Fade

    }

    // Line icon and number

    Elements.LineShield {id: lineShield; lineColor: lineRow.lineColor; state: ""}


    // Endpoint and time
    Label {
        id: toPart
        font.pixelSize: Theme.fontSizeSmall
        text: startName
        color: lineColor
        truncationMode: TruncationMode.Fade
    }
}
