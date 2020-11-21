let video;
let posenet;
let pose;
let canv;
let skeleton;
let tooclose = 0;
let leftElbowOut = 0;
let leftElbowIn = 0;
let rightElbowOut = 0;
let rightElbowIn = 0;
let goodjob = 0;

setup = () => {
  canv = createCanvas(480, 480);
  canv.parent("par");
  video = createCapture(VIDEO);
  video.hide();

  options = {
    imageScaleFactor: 0.3, //0.3
    outputStride: 16, //16
    flipHorizontal: false,
    minConfidence: 0.5,
    maxPoseDetections: 5,
    scoreThreshold: 0.5,
    nmsRadius: 20,
    detectionType: "single",
    multiplier: 0.75,
  };
  posenet = ml5.poseNet(video, options);
  posenet.on("pose", gotPoses);
};

draw = () => {
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  if (pose) {
    for (let i = 5; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(128, 128, 128);
      ellipse(x, y, 8, 8);
    }
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }
};

calcAngle = (A, B, C) => {
  var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
  var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
  var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
  var pi = Math.PI;
  return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / pi);
};

angleForTwoPoints = (x1, y1, x2, y2) => {
  return Math.atan((y2 - y1) / (x2 - x1)) * (180 / Math.PI);
};

isInFrame = () => {
  let sum = 0;
  // check for upper body excluding face
  for (let i = 5; i < 11; i++) {
    sum += pose.keypoints[i].score;
  }
  if (sum < 3) {
    return false;
  }
  return true;
};

isElbowFine = () => {
  le = pose.keypoints[7].position;
  re = pose.keypoints[8].position;
  lw = pose.keypoints[9].position;
  rw = pose.keypoints[10].position;

  let leftSideAngle = angleForTwoPoints(le.x, le.y, lw.x, lw.y);
  let rightSideAngle = angleForTwoPoints(re.x, re.y, rw.x, rw.y);

  leftSideAngle = leftSideAngle < 0 ? 180 + leftSideAngle : leftSideAngle;
  rightSideAngle = rightSideAngle < 0 ? 180 + rightSideAngle : rightSideAngle;

  return { leftSideAngle, rightSideAngle };
};

gotPoses = (poses) => {
  console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    var instr = document.getElementById("instruction");

    const { leftSideAngle, rightSideAngle } = isElbowFine();

    if (!isInFrame()) {
      tooclose += 1;
      if (tooclose > 5) {
        document.getElementById("par").style.borderColor = "#febc1d";
        instr.innerHTML = "Too close to the camera";
        tooclose = 0;
        leftElbowOut = 0;
        leftElbowIn = 0;
        rightElbowOut = 0;
        rightElbowIn = 0;
        goodjob = 0;
      }
      return;
    }

    if (leftSideAngle > 120) {
      leftElbowOut += 1;
      if (leftElbowOut > 5) {
        document.getElementById("par").style.borderColor = "#febc1d";
        instr.innerHTML = "Bend your left hand inwards";
        tooclose = 0;
        leftElbowOut = 0;
        leftElbowIn = 0;
        rightElbowOut = 0;
        rightElbowIn = 0;
        goodjob = 0;
      }
      return;
    }

    if (leftSideAngle < 65) {
      leftElbowIn += 1;
      if (leftElbowIn > 5) {
        document.getElementById("par").style.borderColor = "#febc1d";
        instr.innerHTML = "Bend your left hand outwards";
        tooclose = 0;
        leftElbowOut = 0;
        leftElbowIn = 0;
        rightElbowOut = 0;
        rightElbowIn = 0;
        goodjob = 0;
      }
      return;
    }

    if (rightSideAngle > 120) {
      rightElbowOut += 1;
      if (rightElbowOut > 5) {
        document.getElementById("par").style.borderColor = "#febc1d";
        instr.innerHTML = "Bend your right hand outwards";
        tooclose = 0;
        leftElbowOut = 0;
        leftElbowIn = 0;
        rightElbowOut = 0;
        rightElbowIn = 0;
        goodjob = 0;
      }
      return;
    }

    if (rightSideAngle < 65) {
      rightElbowOut += 1;
      if (rightElbowOut > 5) {
        document.getElementById("par").style.borderColor = "#febc1d";
        instr.innerHTML = "Bend your right hand inwards";
        tooclose = 0;
        leftElbowOut = 0;
        leftElbowIn = 0;
        rightElbowOut = 0;
        rightElbowIn = 0;
        goodjob = 0;
      }
      return;
    }

    goodjob += 1;
    if (goodjob > 5) {
      document.getElementById("par").style.borderColor = "green";
      instr.innerHTML = "Doing Good";
      tooclose = 0;
      leftElbowOut = 0;
      leftElbowIn = 0;
      rightElbowOut = 0;
      rightElbowIn = 0;
      goodjob = 0;
    }
  }
};
