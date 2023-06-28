// @flow strict
// Copyright (C) 2022 Deep Skills Inc., - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential

import React from "react";

let _apiEndpoint = "";

export function apiEndpoint(): string {
  return _apiEndpoint;
}

export function setApiEndpoint(apiEndpoint: string) {
  _apiEndpoint = apiEndpoint;
}

type BarSetting ={
color:string,
height:string
}

export const ColoredBar = (props:BarSetting) => (
    <hr
        style={{
           
            margin: 0,
            color: props.color,
            backgroundColor: props.color,
            height: props.height
        }}
    />
);

type SetLine = {
newColor:string
}

export const ColoredLine = (props:SetLine) => (
    <hr
        style={{
           
            margin: 0,
            color: props.newColor,
            backgroundColor: props.newColor,
            height: 1
        }}
    />
);


export function parseName(data : string): string {
         const obj =JSON.parse(data);
         return obj.name;
}

export function parseUnits(data : string): string {
         const obj =JSON.parse(data);
         if (obj === undefined) {
           return "Imperical";
         }
         if (obj.unit === true) {
           return "SI";
         }
         return "Imperical";
}

export function parseSheetName(data : string): string {
         const obj =JSON.parse(data);
         return obj.sheet.name;
}

export function parseFileName(data : string): string {
         return "";
}

export function download(filename: string, rawData: string, url: string) {
  const element = document.createElement("a");
  if (rawData !== "") {
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(rawData));
  }
  if (url !== "") {
    element.href = url;
  }
  element.setAttribute("download", filename);

  element.style.display = "none";
  if (document.body !== null) {
    document.body.appendChild(element);
  }
  element.click();
  if (document.body !== null) {
    document.body.removeChild(element);
  }
}

export function convertMAPKMLtoJSON(filename: string): Array<Any> {
}

export function convertReadingsCSVtoJSON(filename: string): Array<Any> {
}


export function csvToArray(str:string, str1:string, delimiter = ",") {
//  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  let arr = [];
  if (str1 === "CHART") { 
  const headers = ["offset", "x", "y", "z", "rms"];
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  if (rows[rows.length-1] === "") {
    rows.splice(rows.length-1, 1);
  }
  arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      if (header !== "rms") {
        object[header] = parseFloat(values[index]);
      } else {
       const x=parseFloat(values[1]), y=parseFloat(values[2]), z=parseFloat(values[3]);
       object[header] = parseFloat(Math.sqrt((x*x)+ (y*y)+(z*z)).toFixed(4));

      }
      return object;
    }, {});
    return el;
  });
  }
  if (str1 === "SIGNAL") { 
  const headers = ["offset"];
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  if (rows[rows.length-1] === "") {
    rows.splice(rows.length-1, 1);
  }
  arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
        object[header] = parseFloat(values[index]);
        return object;
    }, {});
    return el;
  });
  }

  return arr;
}

export function parseCoordinatesFromKML(plainText, offset) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(plainText, "text/xml");
    const kmlDistancePoints= [];

    if (xmlDoc.documentElement.nodeName === "kml") {

      for (const item of xmlDoc.getElementsByTagName("Placemark")) {
        //const placeMarkName = item.getElementsByTagName("name")[0].childNodes[0].nodeValue.trim();
        const lineStrings = item.getElementsByTagName("LineString");

        /** LINESTRIN PARSE **/        
        for (const lineString of lineStrings) {
          const coords = lineString.getElementsByTagName("coordinates")[0].childNodes[0].nodeValue.trim();
          const points = coords.split(" ");
          for (const point of points) {
            const coord = point.split(",");
              kmlDistancePoints.push({ lat: +coord[1], lon: +coord[0], dist: 0.00 });
          }
        }
      }
    } 
    let dist = parseFloat(offset);

    for (let i=0; i < kmlDistancePoints.length; i++) {
       if (i === 0) {
        kmlDistancePoints[i].dist = dist;
       }
       if (i !== 0) {
         dist += HaversineDistanceMeters(kmlDistancePoints[i-1].lat, kmlDistancePoints[i-1].lon,
                                        kmlDistancePoints[i].lat, kmlDistancePoints[i].lon);
         kmlDistancePoints[i].dist = parseFloat(dist.toFixed(2));  
       }
    }
    return kmlDistancePoints;

}

function HaversineDistanceMeters(p1Lat, p1Lon, p2Lat, p2Lon) {

	const lat1 = p1Lat * (Math.PI / 180);
	const lon1 = p1Lon * (Math.PI / 180);
	const lat2 = p2Lat * (Math.PI / 180);
	const lon2 = p2Lon * (Math.PI / 180);

	const diffLat = lat2 - lat1;
	const diffLon = lon2 - lon1;

	const a = Math.pow(Math.sin(diffLat/2), 2) + Math.cos(lat1)*Math.cos(lat2)*Math.pow(Math.sin(diffLon/2), 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return c * 6371000;
}

