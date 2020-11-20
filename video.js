let video;
let posenet;
let pose;
let skeleton;

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
  createCanvas(1000, 1000);
  video = createCapture(VIDEO);
  video.hide()

  // setting up the poseNet model to feed in the video feed.
  options = {
    imageScaleFactor: 0.6,  //0.3
    outputStride: 8,        //16
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

function isSquat() {
  ls = pose.keypoints[5].poistion
  rs = pose.keypoints[6].position
  le = pose.keypoints[7].position
  re = pose.keypoints[8].position
  lw = pose.keypoints[9].position
  rw = pose.keypoints[10].position
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
  if(angle>75 && angle<115) {
    return true;
  }
  return false;
}

function gotPoses(poses) {
  console.log(poses);
  if(poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    
    // shoulder, elbow, wrist, hip, knee, ankle
  
    if(isSquat()) {
      var x = document.getElementById("snackbar");

      // Add the "show" class to DIV
      x.className = "show";

      // After 3 seconds, remove the show class from DIV
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

  }
}

function draw() {
  image(video,0,0);
  if(pose) {
    
    // for(let i=0;i<pose.keypoints.length;i++) {
    //   let x = pose.keypoints[i].position.x
    //   let y = pose.keypoints[i].position.y
    //   fill(0,255,0)
    //   ellipse(x,y,16,16)
    // }
    for(let i=0;i<skeleton.length;i++) {
      let a = skeleton[i][0]
      let b = skeleton[i][1]
      strokeWeight(2);
      stroke(255);
      line(a.position.x,a.position.y,b.position.x,b.position.y);
    }
  }
}