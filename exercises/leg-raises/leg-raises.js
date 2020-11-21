let video;
let posenet;
let pose;
let canv;
let skeleton;
let tooclose = 0;
let straightback = 0;
let straightleg = 0;
let raiseleg = 0;
let goodjob = 0;

function calcAngle(A,B,C) {
  var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
  var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
  var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
  var pi = Math.PI;
  return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB)) * (180/pi);
}

// p5.js setup() function to set up the canvas for the web cam video stream
function setup() {
  //creating a canvas by giving the dimensions
  canv = createCanvas(480,480);
  canv.parent("par");
  video = createCapture(VIDEO);
  video.hide()

  // setting up the poseNet model to feed in the video feed.
  options = {
    imageScaleFactor: 0.3,  //0.3
    outputStride: 16,       //16
    flipHorizontal: false,
    minConfidence: 0.5,
    maxPoseDetections: 5,
    scoreThreshold: 0.5,
    nmsRadius: 20,
    detectionType: 'single',
    multiplier: 0.75,
   }
  posenet = ml5.poseNet(video,options);
  posenet.on("pose", gotPoses);
}

function isInFrame() {
  let sum = 0;
  for(let i=11;i<17;i++) {
    sum+=pose.keypoints[i].score
  }
  if(sum<4) {
    // lower body not detected
    return false;
  }
  return true;
}

function isBackStraight() {
  
  ls = pose.keypoints[5].position
  rs = pose.keypoints[6].position
  
  lh = pose.keypoints[11].position
  rh = pose.keypoints[12].position

  hip = lh
  hip.x = (lh.x + rh.x)/2.0
  hip.y = (lh.y + rh.y)/2.0

  shoulder = ls
  shoulder.x = (ls.x + rs.x)/2.0
  shoulder.y = (ls.y + rs.y)/2.0


  return Math.abs(Math.atan( (shoulder.y - hip.y) / (shoulder.x - hip.x) )) * (180/Math.PI);
}

function isLegStraight() {
  
  lh = pose.keypoints[11].position
  rh = pose.keypoints[12].position
  lk = pose.keypoints[13].position
  rk = pose.keypoints[14].position
  la = pose.keypoints[15].position
  ra = pose.keypoints[16].position

  hip = lh
  hip.x = (lh.x + rh.x)/2.0
  hip.y = (lh.y + rh.y)/2.0

  knee = lk
  knee.x = (lk.x + rk.x)/2.0
  knee.y = (lk.y + rk.y)/2.0

  ankle = la
  ankle.x = (la.x + ra.x)/2.0
  ankle.y = (la.y + ra.y)/2.0

  angle = calcAngle(lh,lk,la);
  return angle;
}

function isLegRaised() {
  
  ls = pose.keypoints[5].position
  rs = pose.keypoints[6].position
  lh = pose.keypoints[11].position
  rh = pose.keypoints[12].position
  lk = pose.keypoints[13].position
  rk = pose.keypoints[14].position

  hip = lh
  hip.x = (lh.x + rh.x)/2.0
  hip.y = (lh.y + rh.y)/2.0

  knee = lk
  knee.x = (lk.x + rk.x)/2.0
  knee.y = (lk.y + rk.y)/2.0

  shoulder = ls
  shoulder.x = (ls.x + rs.x)/2.0
  shoulder.y = (ls.y + rs.y)/2.0

  angle = calcAngle(ls,lh,lk);
  return angle;
}

function gotPoses(poses) {
  console.log(poses);
  if(poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    var instr = document.getElementById("instruction");
    
    if(!isInFrame()) {
      tooclose+=1;
      if(tooclose>5) {
        document.getElementById("par").style.borderColor ="#febc1d";
        instr.innerHTML = "Too close to the camera";
        tooclose = 0;
        straightback = 0;
        straightleg = 0;
        raiseleg = 0;
        goodjob = 0;
      }
      return;
    }
    backAngle = isBackStraight()
    
    if(backAngle > 20) {
      straightback+=1;
      if(straightback > 5) {
        document.getElementById("par").style.borderColor ="#febc1d";
        instr.innerHTML = "Straighten Your Back";
        tooclose = 0;
        straightback = 0;
        straightleg = 0;
        raiseleg = 0;
        goodjob = 0;        
      }
      return;
    }
    kneeAngle = isLegStraight()
    if(kneeAngle < 150){
      straightleg+=1;
      if(straightleg > 5) {
        document.getElementById("par").style.borderColor ="#febc1d";
        instr.innerHTML = "Straighten Your Leg";
        tooclose = 0;
        straightback = 0;
        straightleg = 0;
        raiseleg = 0;
        goodjob = 0;        
      }
      return;
    }
    hipAngle = isLegRaised()
    if(hipAngle > 100){
      raiseleg+=1;
      if(raiseleg > 5) {
        document.getElementById("par").style.borderColor ="#febc1d";
        instr.innerHTML = "Raise Your Leg";
        tooclose = 0;
        straightback = 0;
        straightleg = 0;
        raiseleg = 0;
        goodjob = 0;  
      }
      return;
    }
    goodjob+=1;
    if(goodjob > 5) {
      document.getElementById("par").style.borderColor ="#febc1d";
      instr.innerHTML = "Doing Good";
      tooclose = 0;
      straightback = 0;
      straightleg = 0;
      raiseleg = 0;
      goodjob = 0; 
    }
  }
}

function draw() {
  translate(video.width, 0);
  scale(-1, 1);
  image(video,0,0);
  if(pose) {
    for(let i=5;i<pose.keypoints.length;i++) {
      let x = pose.keypoints[i].position.x
      let y = pose.keypoints[i].position.y
      fill(128,128,128)
      ellipse(x,y,8,8)
    }
    for(let i=0;i<skeleton.length;i++) {
      let a = skeleton[i][0]
      let b = skeleton[i][1]
      strokeWeight(2);
      stroke(255);
      line(a.position.x,a.position.y,b.position.x,b.position.y);
    }
  }
}