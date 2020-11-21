let video;
let posenet;
let pose;
let canv;
let skeleton;
let tooclose = 0;
let kneelow = 0;
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
  return Math.atan(Math.abs(y2 - y1) / Math.abs(x2 - x1)) * (180 / Math.PI);
};

isInFrame = () => {
  let sum = 0;
  for(let i=11;i<15;i++) {
    sum+=pose.keypoints[i].score
  }
  if(sum<1) {
    // lower body not detected
    return false;
  }
  return true;
};

isKneeHigh = () => {

  lh = pose.keypoints[11].position
  rh = pose.keypoints[12].position
  lk = pose.keypoints[13].position
  rk = pose.keypoints[14].position

  hip = lh
  hip.x = (lh.x + rh.x)/2.0
  hip.y = (lh.y + rh.y)/2.0

  knee = lk.y < rk.y ? lk : rk
  console.log(hip)
  console.log(knee)
  console.log("#############################")
  angle = angleForTwoPoints(hip.x,hip.y,knee.x,knee.y);
  // console.log(angle);
  if(knee.y < hip.y)
    return 0;
  return angle;
}

gotPoses = (poses) => {
  // console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    var instr = document.getElementById("instruction");

    if (!isInFrame()) {
      tooclose += 1;
      if (tooclose > 5) {
        document.getElementById("par").style.borderColor = "#febc1d";
        instr.innerHTML = "Too close to the camera";
        tooclose = 0;
        kneelow = 0;
        goodjob = 0;
      }
      return;
    }
    angle = isKneeHigh();
    if (angle > 40) {
      kneelow += 1;
      if (kneelow > 5) {
        document.getElementById("par").style.borderColor = "#febc1d";
        instr.innerHTML = "Raise knees a bit higher";
        tooclose = 0;
        kneelow = 0;
        goodjob = 0;
      }
      return;
    }
    goodjob += 1;
    if (goodjob > -1) {
      document.getElementById("par").style.borderColor = "green";
      instr.innerHTML = "Form is good keep going";
      tooclose = 0;
      kneelow = 0;
      goodjob = 0;
    }
  }
};
