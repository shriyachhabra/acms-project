$(function () {


    //NOTE: map contains the result of the query according to the component id
 var map=sessionStorage.getItem("map")
    map=JSON.parse(map)
 var components=sessionStorage.getItem("components")
    components=JSON.parse(components)
    console.log(components)
    //console.log(map)
 for(let i in components){
     let outputCSV="";
     let ele=components[i]
     //console.log(ele)
     let x=ele['x-val']
     let y=ele['y-val']
     outputCSV+=x+","+y+"\n";
     let arr=map[ele['id']]
     //console.log(arr)
    for(let j in arr ){

        outputCSV+=arr[j][x]+","+arr[j][y]+"\n"
    }
    console.log(outputCSV)

     let type=ele['type']
     //Koshima di code

    }


})