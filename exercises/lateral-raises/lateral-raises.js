let video;
let posenet;
let pose;
let canv;
let skeleton;
let tooclose = 0;
let goodjob = 0;

let leftWrist = 0;
let leftElbow = 0;
let rightWrist = 0;
let rightElbow = 0;

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

angleForTwoPoints = (x1, y1, x2, y2) => {
  return Math.abs(Math.atan((y2 - y1) / (x2 - x1))) * (180 / Math.PI);
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

isFine = () => {
  ls = pose.keypoints[5].position;
  rs = pose.keypoints[6].position;
  le = pose.keypoints[7].position;
  re = pose.keypoints[8].position;
  lw = pose.keypoints[9].position;
  rw = pose.keypoints[10].position;

  const leftSideAngleEW = angleForTwoPoints(le.x, le.y, lw.x, lw.y);
  const leftSideAngleES = angleForTwoPoints(le.x, le.y, ls.x, ls.y);
  const rightSideAngleEW = angleForTwoPoints(re.x, re.y, rw.x, rw.y);
  const rightSideAngleES = angleForTwoPoints(re.x, re.y, rs.x, rs.y);

  return {
    leftSideAngleEW,
    leftSideAngleES,
    rightSideAngleEW,
    rightSideAngleES,
  };
};

gotPoses = (poses) => {
  console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    var instr = document.getElementById("instruction");

    const {
      leftSideAngleEW,
      leftSideAngleES,
      rightSideAngleEW,
      rightSideAngleES,
    } = isFine();

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

    if (leftSideAngleES > 30) {
      leftElbow += 1;
      if (leftElbow > 5) {
        document.getElementById("par").style.borderColor = "#febc1d";
        instr.innerHTML = "Make your left elbow parallel to your shoulder";
        tooclose = 0;
        leftWrist = 0;
        leftElbow = 0;
        rightWrist = 0;
        rightElbow = 0;
        goodjob = 0;
      }
      return;
    }

    if (rightSideAngleES > 30) {
      rightElbow += 1;
      if (rightElbow > 5) {
        document.getElementById("par").style.borderColor = "#febc1d";
        instr.innerHTML = "Make your right elbow parallel to your shoulder";
        tooclose = 0;
        leftWrist = 0;
        leftElbow = 0;
        rightWrist = 0;
        rightElbow = 0;
        goodjob = 0;
      }
      return;
    }

    if (leftSideAngleEW > 30) {
      leftWrist += 1;
      if (leftWrist > 5) {
        document.getElementById("par").style.borderColor = "#febc1d";
        instr.innerHTML = "Left wrist should be parallel to shoulder";
        tooclose = 0;
        leftWrist = 0;
        leftElbow = 0;
        rightWrist = 0;
        rightElbow = 0;
        goodjob = 0;
      }
      return;
    }

    if (rightSideAngleEW > 30) {
      rightWrist += 1;
      if (rightWrist > 5) {
        document.getElementById("par").style.borderColor = "#febc1d";
        instr.innerHTML = "Right wrist should be parallel to shoulder";
        tooclose = 0;
        leftWrist = 0;
        leftElbow = 0;
        rightWrist = 0;
        rightElbow = 0;
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
