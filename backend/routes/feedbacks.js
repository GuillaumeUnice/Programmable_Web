/**
 * Created by sy306571 on 04/01/16.
 */
var express = require('express');
var router = express.Router();

/* GET feedbacks listing for a particular mix. */
router.get('/:idMix', function(req, res) {
    var idMix = +req.params.idMix;
    var cursor = req.db.collection('mixes').find({"id" : idMix });
    cursor.each(function(err, doc) {
        if (doc != null) {
            res.json(doc.feedbacks);
        }
    });
});

router.post('/:idMix', function(req, res) {
    console.log(req.body.mark);
    if(!isNaN(parseFloat(req.body.mark)) && isFinite(req.body.mark)){
        var newFeedback = { mark: +req.body.mark, comment: req.body.comment};
        var idMix = +req.params.idMix;
        req.db.collection('mixes').updateOne({"id" : idMix },{ $push: { "feedbacks": newFeedback } });
        res.send('Feedback added!');
    }
    else{
        res.send('Error!');
    }
});

module.exports = router;