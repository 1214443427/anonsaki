function LAppLive2DManager(canvas)
{
    // console.log("--> LAppLive2DManager()");
    
    
    this.models = [];  
    
    
    this.count = -1;
    this.reloadFlg = false; 
    
    Live2D.init();
    Live2DFramework.setPlatformManager(new PlatformManager(canvas));
    
}

LAppLive2DManager.prototype.createModel = function(gl, no)
{
    
    var model = new LAppModel();
    this.models.push(model);

    // if(no == 0){
    //     this.models[0].load(gl, LAppDefine.MODEL_SAKI);
    // }else{
    //     this.models[0].load(gl, LAppDefine.MODEL_ANON);
    // }
            

    // var model2 = new LAppModel();
    // this.models.push(model2);
    // this.models[0].load(gl,LAppDefine.MODEL_SAKI);
    // this.models[1].load(gl,LAppDefine.MODEL_ANON); //load 2 to test


    return model;
}


LAppLive2DManager.prototype.changeModel = function(gl, model)
{
    // console.log("--> LAppLive2DManager.update(gl)");
    
    if (this.reloadFlg)
    {
        
        this.reloadFlg = false;
        var no = parseInt(this.count % 5);

        var thisRef = this;
        console.log("changeModel", model)
        switch (model)
        {
            case 0: 
                this.releaseModel(1, gl);
                this.releaseModel(0, gl);
                
                this.createModel();
                this.models[0].load(gl, LAppDefine.MODEL_SAKI);
                break;
            case 1: 
                this.releaseModel(0, gl);
                this.createModel();
                this.models[0].load(gl, LAppDefine.MODEL_ANON);
                break;
            default:
                break;
        }
    }
};


LAppLive2DManager.prototype.getModel = function(no)
{
    // console.log("--> LAppLive2DManager.getModel(" + no + ")");
    
    if (no >= this.models.length) return null;
    
    return this.models[no];
};



LAppLive2DManager.prototype.releaseModel = function(no, gl)
{
    // console.log("--> LAppLive2DManager.releaseModel(" + no + ")");
    
    if (this.models.length <= no) return;

    this.models[no].release(gl);
    
    delete this.models[no];
    this.models.splice(no, 1);
};



LAppLive2DManager.prototype.numModels = function()
{
    return this.models.length;
};



LAppLive2DManager.prototype.setDrag = function(x, y)
{
    for (var i = 0; i < this.models.length; i++)
    {
        this.models[i].setDrag(x, y);
    }
}



LAppLive2DManager.prototype.maxScaleEvent = function()
{
    if (LAppDefine.DEBUG_LOG)
        console.log("Max scale event.");
    for (var i = 0; i < this.models.length; i++)
    {
        this.models[i].startRandomMotion(LAppDefine.MOTION_GROUP_PINCH_IN,
                                         LAppDefine.PRIORITY_NORMAL);
    }
}



LAppLive2DManager.prototype.minScaleEvent = function()
{
    if (LAppDefine.DEBUG_LOG)
        console.log("Min scale event.");
    for (var i = 0; i < this.models.length; i++)
    {
        this.models[i].startRandomMotion(LAppDefine.MOTION_GROUP_PINCH_OUT,
                                         LAppDefine.PRIORITY_NORMAL);
    }
}



LAppLive2DManager.prototype.tapEvent = function(x, y)
{    
    if (LAppDefine.DEBUG_LOG)
        console.log("tapEvent view x:" + x + " y:" + y);

    for (var i = 0; i < this.models.length; i++)
    {

        if ( x > -0.3 && x < 0.3 && y < 0.8 && y > 0.2)
        {
            
            if (LAppDefine.DEBUG_LOG)
                console.log("Tap face.", this.lastInteraction);
            
            // this.models[i].setRandomExpression();
            this.models[i].setExpression("smile02")
            setTimeout(this.models[i].setExpression.bind(this.models[i], "idle01"), 1000)
        }
        else if (this.models[i].hitTest(LAppDefine.HIT_AREA_BODY, x, y))
        {
            
            if (LAppDefine.DEBUG_LOG)
                console.log("Tap body." + " models[" + i + "]");

            this.models[i].startRandomMotion(LAppDefine.MOTION_GROUP_TAP_BODY,
                                             LAppDefine.PRIORITY_NORMAL);
        }
    }

    return true;
};

LAppLive2DManager.prototype.idelEvent = function(){
    console.log("idle event")
}