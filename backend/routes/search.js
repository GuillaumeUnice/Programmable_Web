/**
 * Created by sy306571 on 18/01/16.
 */
var express = require('express');
var router = express.Router();

router.post('/mixes', function(req, res) {
    //Recherche uniquement par nom de mix
    req.db.collection("mixes").createIndex( { name : "text" } ); //Il faudrait le mettre en amont. Ou ? Telle est la
                                                                    //la question

    var cursor = req.db.collection("mixes").find( { $text: { $search: req.body.motsCles } } );
    var result = [];
    cursor.each(function(err, doc) {
        if (doc != null) {
            result.push(doc)
        }
        else{
            res.send(result);
        }
    });
});

module.exports = router;