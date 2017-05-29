app.filter('startsWithLetter', function () {
    return function (items, letter) {
        var filtered = [];
        var letterMatch = new RegExp(letter, 'i');
        try {
            //console.log("Entering")
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (letterMatch.test(item.substring(0, letter.length))) {
                    filtered.push(item);
                }
            }
            return filtered;
        }
        catch(e){
            return items;
        }
    };
});

app.filter('unique', function () {
    // we will return a function which will take in a collection
    // and a keyname
    return function (collection, keyname) {
        // we define our output and keys array;
        var output = [],
            keys = [];

        // we utilize angular's foreach function
        // this takes in our original collection and an iterator function
        angular.forEach(collection, function (item) {
            // we check to see whether our object exists
            var key = item[keyname];
            // if it's not already part of our keys array
            if (keys.indexOf(key) === -1) {
                // add it to our keys array
                keys.push(key);
                // push this item to our final output array
                output.push(item);
            }
        });
        // return our array which should be devoid of
        // any duplicates
        return output;
    };
});

app.filter('textFormat', function () {

    return function (text) {
     //   console.log(text + "text");
        var ch, i;
        var formattedText = "";
        var text = "" + text;
      //  console.log("herereree");
      //  console.log("text.length " + text.length);
        for (i = 0; i < text.length ; i++) {
          //  console.log("in forr");
            if (i == 0) {
                ch = text[i].toUpperCase();

            }
            else {
               ch = text[i].toLowerCase();
            }
            formattedText = formattedText + ch;
        }
      //  console.log("formattedText :" + formattedText);
        return formattedText;
    };
});