
function prepareTrain(metrics, genders, agegroups) {
    let data = [];
    let labels_agegroup = [];
    let labels_gender = [];

    for (let metric of metrics) {
        let point = [];

        point.push(metric.mouseSpeedAvg);
        point.push(metric.mouseSpeedMin);
        point.push(metric.mouseSpeedMax);
        point.push(metric.nofKeysPressed);
        point.push(metric.nofMouseClicks);
        point.push(metric.nofMouseMoves);
        point.push(metric.puzzleAvgMoveTime);
        point.push(metric.puzzleMoves);
        point.push(metric.timeBetweenClicksAvg);
        point.push(metric.timeBetweenClicksMax);
        point.push(metric.timeBetweenClicksMin);
        point.push(metric.timeBetweenKeysAvg);
        point.push(metric.timeBetweenKeysMax);
        point.push(metric.timeBetweenKeysMin);
        point.push(metric.typingErrors);
        point.push(metric.typingTime);

        data.push(point);

        labels_agegroup.push(metric.agegroup);
        labels_gender.push(metric.gender);
    }

    labels_gender = labels_gender.map((elem) => genders.indexOf(elem));
    labels_agegroup = labels_agegroup.map((elem) => agegroups.indexOf(elem));

    return {
        data,
        labels_gender,
        labels_agegroup
    };
}

module.exports = {
    prepareTrain
};
