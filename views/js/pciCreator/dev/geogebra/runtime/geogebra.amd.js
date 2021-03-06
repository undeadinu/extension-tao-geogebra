define(['qtiCustomInteractionContext', 'IMSGlobal/jquery_2_1_1', 'geogebra/runtime/js/renderer', 'OAT/util/event'], function(qtiCustomInteractionContext, $, renderer, event){

    var geogebraExercise = {
        id : -1,
        getTypeIdentifier : function(){
            return 'geogebra';
        },
        /**
         * Render the PCI : 
         * @param {String} id
         * @param {Node} dom
         * @param {Object} config - json
         */
        initialize : function(id, dom, config, assetManager){

            //add method on(), off() and trigger() to the current object
            event.addEventMgr(this);

            var _this = this;
//            var assetManager = qtiCustomInteractionContext.getAssetResolver(this.getTypeIdentifier());//that would introduce dependency between the asset manager and global pci runtime context
            this.id = id;
            this.dom = dom;
            this.config = config || {width: 600, height:450};

            _this.applet = renderer.render(this.id, this.dom, this.config, assetManager);

            //tell the rendering engine that I am ready
            qtiCustomInteractionContext.notifyReady(this);

            //listening to dynamic configuration change
            this.on('sizechange', function(width, height){
                if(width > 100){
                    _this.config.width = width;
                }
                if(height > 100){
                    _this.config.height = height;
                }
                renderer.resize(_this.applet, _this.config);
            });
        },
        /**
         * Programmatically set the response following the json schema described in
         * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
         * 
         * @param {Object} interaction
         * @param {Object} response
         */
        setResponse : function(response){
			//TODO
        },
        /**
         * Get the response in the json format described in
         * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
         * 
         * @param {Object} interaction
         * @returns {Object}
         */
        getResponse : function(){
			var _this = this;
			var fraction = _this.applet.getAppletObject().getExerciseFraction();
			var base64 = _this.applet.getAppletObject().getBase64();
			
        //    return {"record":[{"name":"ggb", "base" : {"file" : {"data":base64,"mime":"text/plain"} } }]};
		return {"base": {"float": fraction}} 

        
        },
        /**
         * Remove the current response set in the interaction
         * The state may not be restored at this point.
         * 
         * @param {Object} interaction
         */
        resetResponse : function(){

            var $container = $(this.dom);

            $container.find('input').prop('checked', false);
        },
        /**
         * Reverse operation performed by render()
         * After this function is executed, only the inital naked markup remains 
         * Event listeners are removed and the state and the response are reset
         * 
         * @param {Object} interaction
         */
        destroy : function(){

            var $container = $(this.dom);
            $container.off().empty();
        },
        /**
         * Restore the state of the interaction from the serializedState.
         * 
         * @param {Object} interaction
         * @param {Object} serializedState - json format
         */
        setSerializedState : function(state){
			console.log(state);
			//var qid = $(this.dom).parent().data("serial");
			//renderer.setBase64(qid, state.base64);
        },
        /**
         * Get the current state of the interaction as a string.
         * It enables saving the state for later usage.
         * 
         * @param {Object} interaction
         * @returns {Object} json format
         */
        getSerializedState : function(){
			var _this = this;
			var state = {};
			if(_this.applet.getAppletObject()){
				state = {"base64": _this.applet.getAppletObject().getBase64()};
			}
			return JSON.stringify(state);
        }
    };

    qtiCustomInteractionContext.register(geogebraExercise);
});