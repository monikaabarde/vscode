var express = require('express');

var router = express.Router();
const passport=require('passport')
const localStrategy=require("passport-local")

var scholarship=require("./scholarships")
const pinfo=require("./users")
passport.use(new localStrategy(pinfo.authenticate()))


/* GET home page. */

// google ki
router.get('/', function(req, res, next) {
  try{
    pinfo.findOne({username:req.session.passport.user},function(err,founduser){
      
      res.render('index', {userdata:founduser});
    })
    }catch(err){
      
      res.render('index', {userdata:null });
    }
  
});

  
router.get('/google', passport.authenticate("google",{scope:["profile"]})
  
);
router.get("/google/callback", 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/myprofile');
  });

  // yha tk
// noraml login

router.get('/myprofile',isLoggedIn, function(req, res, next) {
  console.log(req.session.passport.user);
  pinfo.findOne({username:req.session.passport.user})
    .then(function(foundprofile){
      res.render("myprofile",{data:foundprofile})
    })
  
  
});


router.post('/register', function(req, res, next) {
  
  
  if(req.body.password !==req.body.cpassword){
    try{
      pinfo.findOne({username:req.session.passport.user},function(err,founduser){
        res.render("myerror",{err:"please enter same password",userdata:founduser})
      })
      }catch(err){
        res.render("myerror",{err:"please enter same password",userdata:null})
      }
    
  }else if(!req.body.terms){
    try{
      pinfo.findOne({username:req.session.passport.user},function(founduser){
        res.render("myerror",{err:"please tick on I agree to the terms and conditions",userdata:founduser})
      })
      }catch(err){
        res.render("myerror",{err:"please tick on I agree to the terms and conditions",userdata:null})
      }
  }else{

    const newinfo= new pinfo({
      lname: req.body.lname,
      fname: req.body.fname,
    username:req.body.username,
    // email: req.body.email,
    // mnum: req.body.mnum,
    // dob: req.body.dob,
    // wnum: req.body.wnum,
    // gender:req.body.gender,
    // state: req.body.state,
    // district:req.body.district,
    // religion:req.body.religion,
    // class:req.body.class,
    // course:req.body.course,
    // income:req.body.income,
    // pc:req.body.pc
    
  })
  pinfo.register(newinfo,req.body.password)
  .then(function(u){
    passport.authenticate('local')(req,res,function(){
      res.send("success")
      // res.redirect('/profile')
    })
  })
  .catch(function(e){
    res.send(e)
  })
}
});

router.get('/signup',function(req,res){
  res.render("signup")
})


router.get("/compose",function(req,res){
  res.render('compose');
})
router.post("/createpost",function(req,res){
  var eligibilityPage=req.body.eligibilityPage
  var eligibilityPage=eligibilityPage.split(",,")
  var desirableQualifications=req.body.desirableQualifications
  var desirableQualifications=desirableQualifications.split(",,")
  var benifits=req.body.benifits
  var benifits=benifits.split(",,")
  // yha documents me edit krna h 
  var documents=req.body.documents 
  var taglist=[req.body.girl,req.body.minority,req.body.pd,req.body.scstobc,req.body.westbengal,req.body.uttarpradesh,req.body.bihar,req.body.madhyapradesh,req.body.maharashtra,req.body.karnataka,req.body.rajasthan,req.body.gujarat,req.body.c110,req.body.c1112,req.body.polytechnicdiplomaiti,req.body.graduation,req.body.postgraduation,req.body.phdpostdoctoral,req.body.incomebased,req.body.meritbased,req.body.unitedstates,req.body.australia,req.body.newzealand,req.body.canada,req.body.malaysia,req.body.unitedkingdom,req.body.france,req.body.germany,req.body.ireland,req.body.nspnatioanalmeanscummeritscholarshipsscheme,req.body.nsppostmatricscholarshipsschemeforminorities,req.body.nspprematricscholarshipsschemeforminorities,req.body.nspcentralsectorschemeofscholarshipforcollege,req.body.nsptopclasseducationforscstudents,req.body.specialscholarshipschemeishanudayforner,req.body.postgraduateindiragandhischolarshipforsinglegirlchild,req.body.postgraduatemeritscholarshipforuniversityrankholders]

  documents=documents.split(",,")
  console.log(typeof(documents));
  const newItem= {
  heading: req.body.heading,
  value: req.body.value,
  region:req.body.place,
  about:req.body.about,
  deadline:req.body.ldate,
  eligibilityCard: req.body.eligibilityCard,
  eligibilityPage: eligibilityPage,
  desirableQualifications: desirableQualifications,
  benifits:benifits,
  documents:documents,
  link:req.body.link,
  tags:taglist,
  weblink:req.body.weblink
  }
  scholarship.create(newItem,function(err,data){
    if(err){
      res.send(err)
    }
    else{
      console.log(data);
      res.render('compose');
    }
  })
  
  
})
router.get('/allcourses/:filter', function(req, res, next) {
  scholarship.find({},function(err,data){
    schshow=[]
    data.forEach(function(sch){
      if(sch.tags.indexOf(req.params.filter)!==-1){
        schshow.push(sch)
      }
    })
    try{
    pinfo.findOne({username:req.session.passport.user},function(err,founduser){
        console.log(founduser);
        res.render('courses', {data:schshow,userdata:founduser});
    })
    }catch(err){
      console.log(null);
      res.render('courses', {data:schshow,userdata:null });
    }
  })
});

router.get('/allcourses', function(req, res, next) {
  scholarship.find({},function(err,data){
    res.render('courses', {data});
  })
});
router.get('/login', function(req, res, next) {
  res.render("login")
});
router.get('/subcourses/international', function(req, res, next) {
 
  international=["united-states","australia","new-zealand","canada","malaysia","united-kingdom","france","germany","ireland"]
  allindia=["west-bengal","uttar-pradesh","bihar","madhya-pradesh","maharashtra","karnataka","rajasthan","gujarat"]
  government=["nsppostmatricscholarshipsschemeforminorities","nspprematricscholarshipsschemeforminorities","nspcentralsectorschemeofscholarshipforcollege","nsptopclasseducationforscstudents","specialscholarshipschemeishanudayforner","postgraduateindiragandhischolarshipforsinglegirlchild","postgraduatemeritscholarshipforuniversityrankholders"]
  
  scholarship.find({},function(err,data){
    showsch=[]
    data.forEach(function(sch){
      var f=0
      international.forEach(function(val){
        if(sch.tags.indexOf(val)!==-1){
          f=1
        }
      })
      if(f===1){
        showsch.push(sch)
      }
    })

    res.render('courses', {data:showsch});
  })
});
router.get('/subcourses/allindia', function(req, res, next) {
 
  international=["united-states","australia","new-zealand","canada","malaysia","united-kingdom","france","germany","ireland"]
  allindia=["west-bengal","uttar-pradesh","bihar","madhya-pradesh","maharashtra","karnataka","rajasthan","gujarat"]
  government=["nsppostmatricscholarshipsschemeforminorities","nspprematricscholarshipsschemeforminorities","nspcentralsectorschemeofscholarshipforcollege","nsptopclasseducationforscstudents","specialscholarshipschemeishanudayforner","postgraduateindiragandhischolarshipforsinglegirlchild","postgraduatemeritscholarshipforuniversityrankholders"]
  
  scholarship.find({},function(err,data){
    showsch=[]
    data.forEach(function(sch){
      var f=0
      allindia.forEach(function(val){
        if(sch.tags.indexOf(val)!==-1){
          f=1
        }
      })
      if(f===1){
        showsch.push(sch)
      }
    })

    res.render('courses', {data:showsch});
  })
});
router.get('/subcourses/government', function(req, res, next) {
 
  international=["united-states","australia","new-zealand","canada","malaysia","united-kingdom","france","germany","ireland"]
  allindia=["west-bengal","uttar-pradesh","bihar","madhya-pradesh","maharashtra","karnataka","rajasthan","gujarat"]
  government=["nsppostmatricscholarshipsschemeforminorities","nspprematricscholarshipsschemeforminorities","nspcentralsectorschemeofscholarshipforcollege","nsptopclasseducationforscstudents","specialscholarshipschemeishanudayforner","postgraduateindiragandhischolarshipforsinglegirlchild","postgraduatemeritscholarshipforuniversityrankholders"]
  
  scholarship.find({},function(err,data){
    showsch=[]
    data.forEach(function(sch){
      var f=0
      government.forEach(function(val){
        if(sch.tags.indexOf(val)!==-1){
          f=1
        }
      })
      if(f===1){
        showsch.push(sch)
      }
    })

    res.render('courses', {data:showsch});
  })
});


router.get("/viewscholarship/:id",isLoggedIn,function(req,res){
  scholarship.findOne({_id:req.params.id},function(err,foundsch){
    pinfo.findOne({username:req.session.passport.user},function(founduser){
      res.render("viewscholarship",{data:foundsch,userdata:founduser})
    })
   
  })
  
})

router.post('/login',passport.authenticate("local",{
  successRedirect:"/myprofile",
  failureRedirect:"/"
}),function(req,res,next){})

router.get('/logout',function(req,res,next){
  req.session.destroy(function(e){
    req.logout();
    res.redirect('/');
});
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect("/login")
  }
}

module.exports = router;
