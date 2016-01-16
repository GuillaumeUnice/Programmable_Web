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
        else res.send("No feedback found for this mix");
    });
});

/* POST feedback for a particular mix. */
router.post('/:idMix', function(req, res) {
    var newFeedback = { user: req.body.user, mark: +req.body.mark, comment: req.body.comment};
    var idMix = +req.params.idMix;
    req.db.collection('mixes').updateOne({"id" : idMix },{ $push: { "feedbacks": newFeedback } });
    res.send('Feedback added!');
});



module.exports = router;