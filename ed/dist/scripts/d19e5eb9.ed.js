function djb2(a){for(var b=5381,c=0;c<a.length;c++)b=(b<<5)+b+a.charCodeAt(c);return 0>b&&(b=-b),b}function handleMeshQueryResult(a){for(var b=0;b<a.entity_ids.length;b++){var c=a.entity_ids[b],d=djb2(c)%COLORS.length,e=COLORS[d][0],f=COLORS[d][1],g=COLORS[d][2];console.log(c+": color = "+[e,f,g]),indices=new Uint16Array(a.meshes[b].vertices.length/3);for(var h=0;h<indices.length;h++)indices[h]=h;for(var i=a.meshes[b],j=new Float32Array(a.meshes[b].vertices.length),h=0;h<i.vertices.length;h+=9){p1=[i.vertices[h+0],i.vertices[h+1],i.vertices[h+2]],p2=[i.vertices[h+3],i.vertices[h+4],i.vertices[h+5]],p3=[i.vertices[h+6],i.vertices[h+7],i.vertices[h+8]],v1=SceneJS_math_subVec3(p1,p2,[]),v2=SceneJS_math_subVec3(p1,p3,[]);var k=SceneJS_math_normalizeVec3(SceneJS_math_cross3Vec3(v1,v2));j[h+0]=k[0],j[h+1]=k[1],j[h+2]=k[2],j[h+3]=k[0],j[h+4]=k[1],j[h+5]=k[2],j[h+6]=k[0],j[h+7]=k[1],j[h+8]=k[2]}var k=scene.getNode(c);k.removeNode(c+"-mesh"),k.addNode({type:"material",color:{r:e,g:f,b:g},id:c+"-mesh",nodes:[{type:"geometry",primitive:"triangles",positions:new Float32Array(a.meshes[b].vertices),indices:indices,normals:j}]})}}function edUpdate(a){for(var b=[],c=0;c<a.entities.length;c++){var d=a.entities[c];matrix=SceneJS_math_newMat4FromQuaternion([d.pose.orientation.x,d.pose.orientation.y,d.pose.orientation.z,d.pose.orientation.w]),matrix[12]=d.pose.position.x,matrix[13]=d.pose.position.y,matrix[14]=d.pose.position.z,entity_poses[d.id]=matrix;var e=scene.getNode(d.id);if(e?e.parent.setElements(matrix):(scene.getNode("world").addNode({type:"matrix",elements:matrix}).addNode({type:"name",name:d.id,id:d.id}).addNode({type:"material",color:{r:1,g:0,b:0},id:d.id+"-mesh"}).addNode({type:"prims/box",xSize:.1,ySize:.1,zSize:.1}),b.push(d.id)),d.polygon.xs.length>0){for(var f=d.polygon.xs.length,g=new Float32Array(3*f+3*f+3*f*4),h=new Float32Array(g.length),i=0,j=0;f>j;j++)g[i]=d.polygon.xs[j],g[i+1]=d.polygon.ys[j],g[i+2]=d.polygon.z_max,h[i]=0,h[i+1]=0,h[i+2]=1,i+=3;for(var j=0;f>j;j++)g[i]=d.polygon.xs[j],g[i+1]=d.polygon.ys[j],g[i+2]=d.polygon.z_min,h[i]=0,h[i+1]=0,h[i+2]=-1,i+=3;for(var j=0;f>j;j++){for(var k=(j+1)%f,l=d.polygon.xs[k]-d.polygon.xs[j],m=d.polygon.ys[k]-d.polygon.ys[j],n=SceneJS_math_normalizeVec3(SceneJS_math_cross3Vec3([l,m,0],[0,0,1])),o=0;12>o;o+=3)h[i+o]=n[0],h[i+o+1]=n[1],h[i+o+2]=n[2];g[i++]=d.polygon.xs[j],g[i++]=d.polygon.ys[j],g[i++]=d.polygon.z_min,g[i++]=d.polygon.xs[j],g[i++]=d.polygon.ys[j],g[i++]=d.polygon.z_max,g[i++]=d.polygon.xs[k],g[i++]=d.polygon.ys[k],g[i++]=d.polygon.z_min,g[i++]=d.polygon.xs[k],g[i++]=d.polygon.ys[k],g[i++]=d.polygon.z_max}for(var p=new Uint16Array(3*(f-2)+3*(f-2)+2*f*3),q=0,j=0;f-2>j;j++)p[q++]=0,p[q++]=j+1,p[q++]=j+2;for(var j=0;f-2>j;j++)p[q++]=f,p[q++]=f+j+1,p[q++]=f+j+2;for(var j=0;4*f>j;j+=4)p[q++]=2*f+j,p[q++]=2*f+j+1,p[q++]=2*f+j+3,p[q++]=2*f+j+3,p[q++]=2*f+j+2,p[q++]=2*f+j;var e=scene.getNode(d.id);e.removeNode(d.id+"-mesh"),e.addNode({type:"material",color:{r:0,g:.6,b:0},id:d.id+"-mesh",nodes:[{type:"geometry",primitive:"triangles",positions:g,indices:p,normals:h}]})}}if(b.length>0){var r=new ROSLIB.ServiceRequest({entity_ids:b});clientQueryMeshes.callService(r,function(a){handleMeshQueryResult(a)})}}function onEntityClick(a){var b=a.name;console.log("Entity picked: "+b),nSelectionBox=scene.getNode("selection-box"),matrix=entity_poses[b],matrix[14]=2,nSelectionBox.setElements(matrix);var c=new ROSLIB.ServiceRequest({command_yaml:"{ action: navigate_to, entity: "+b+" }"});clientInteract.callService(c,function(a){console.log("Result from Interact server: "+a)})}!function(){function a(a){var b,c,d;a.size?(b=a.size[0],c=a.size[1],d=a.size[2]):(b=a.xSize||1,c=a.ySize||1,d=a.zSize||1);var e="prims/box_"+b+"_"+c+"_"+d+(a.wire?"wire":"_solid");return this.getScene().hasCore("geometry",e)?{type:"geometry",coreId:e}:{type:"geometry",primitive:a.wire?"lines":"triangles",coreId:e,positions:new Float32Array([b,c,d,-b,c,d,-b,-c,d,b,-c,d,b,c,d,b,-c,d,b,-c,-d,b,c,-d,b,c,d,b,c,-d,-b,c,-d,-b,c,d,-b,c,d,-b,c,-d,-b,-c,-d,-b,-c,d,-b,-c,-d,b,-c,-d,b,-c,d,-b,-c,d,b,-c,-d,-b,-c,-d,-b,c,-d,b,c,-d]),normals:new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1]),uv:new Float32Array([b,c,0,c,0,0,b,0,0,c,0,0,b,0,b,c,b,0,b,c,0,c,0,0,b,c,0,c,0,0,b,0,0,0,b,0,b,c,0,c,0,0,b,0,b,c,0,c]),indices:new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23])}}SceneJS.Types.addType("prims/box",{construct:function(b){this.addNode(a.call(this,b))}})}(),SceneJS.Types.addType("ed_camera",{construct:function(a){function b(a){if(l=a.clientX,m=a.clientY,w=a.button,2==a.button){var b=a.clientX*scenejs_canvas_width/$("#canvas-1").width(),c=a.clientY*scenejs_canvas_height/$("#canvas-1").height();scene.pick(b,c)}}function c(a){a.preventDefault()}function d(a){l=a.targetTouches[0].clientX,m=a.targetTouches[0].clientY,w=1}function e(){w=-1}function f(){w=-1}function g(a){var b=a.clientX,c=a.clientY;i(b,c,w)}function h(a){var b=a.targetTouches[0].clientX,c=a.targetTouches[0].clientY;i(b,c,a.button)}function i(a,b,c){if(w>=0){if(0==c)o-=(a-l)*t,p+=(b-m)*u;else if(1==c){var d=(a-l)*q*.002,e=(b-m)*q*.002,f=Math.sin(.0174532925*o),g=Math.cos(.0174532925*o);y.x+=f*d-g*e,y.y+=-g*d-f*e}k(),l=a,m=b}}function j(a){var b=0;a||(a=window.event),a.wheelDelta?(b=a.wheelDelta/120,window.opera&&(b=-b)):a.detail&&(b=-a.detail/3),b&&(0>b?q*=1+v:q/=1+v),a.preventDefault&&a.preventDefault(),a.returnValue=!1,k()}function k(){void 0!=r&&r>p&&(p=r),void 0!=s&&p>s&&(p=s);var a=SceneJS_math_rotationMat4v(.0174532925*p,[0,-1,0]),b=SceneJS_math_transformPoint3(a,[q,0,0]),c=SceneJS_math_rotationMat4v(.0174532925*o,[0,0,1]),d=SceneJS_math_transformPoint3(c,b);n.setEye({x:d[0]+y.x,y:d[1]+y.y,z:d[2]+y.z}),n.setLook(y)}var l,m,n=this.addNode({type:"lookAt",nodes:a.nodes}),o=a.yaw||0,p=a.pitch||0,q=a.zoom||10,r=a.minPitch,s=a.maxPitch,t=a.yawSensitivity||.1,u=a.pitchSensitivity||.1,v=a.zoomSensitivity||.9,w=-1,x=a.eye||{x:0,y:0,z:0},y=a.look||{x:0,y:0,z:0};n.set({eye:{x:x.x,y:x.y,z:-q},look:{x:y.x,y:y.y,z:y.z},up:{x:0,y:0,z:1}}),k();var z=this.getScene().getCanvas();z.addEventListener("mousedown",b,!0),z.addEventListener("mousemove",g,!0),z.addEventListener("mouseup",e,!0),z.addEventListener("touchstart",d,!0),z.addEventListener("touchmove",h,!0),z.addEventListener("touchend",f,!0),z.addEventListener("mousewheel",j,!0),z.addEventListener("contextmenu",c,!0),z.addEventListener("DOMMouseScroll",j,!0)},setLook:function(){},destruct:function(){}}),SceneJS.setConfigs({pluginPath:"scenejs_plugins"});var scene,clientQueryMeshes,clientInteract,entity_poses={},scenejs_canvas_width,scenejs_canvas_height,COLORS=[[.6,.6,.6],[.6,.6,.4],[.6,.6,.2],[.6,.4,.6],[.6,.4,.4],[.6,.4,.2],[.6,.2,.6],[.6,.2,.4],[.6,.2,.2],[.4,.6,.6],[.4,.6,.4],[.4,.6,.2],[.4,.4,.6],[.4,.4,.4],[.4,.4,.2],[.4,.2,.6],[.4,.2,.4],[.4,.2,.2],[.2,.6,.6],[.2,.6,.4],[.2,.6,.2],[.2,.4,.6],[.2,.4,.4],[.2,.4,.2],[.2,.2,.6],[.2,.2,.4],[.2,.2,.2]];$(document).ready(function(){scene=SceneJS.createScene({nodes:[{type:"ed_camera",yaw:0,pitch:45,zoom:10,zoomSensitivity:.2,minPitch:1,maxPitch:89,yawSensitivity:.2,pitchSensitivity:.2,nodes:[{type:"matrix",elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],id:"world"}]}]}),scene.getNode("world").addNode({type:"matrix",id:"selection-box",elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,2,1]}).addNode({type:"material",color:{r:0,g:1,b:0}}).addNode({type:"prims/box",xSize:.01,ySize:.01,zSize:2}),scene.on("pick",function(a){onEntityClick(a)}),scenejs_canvas_width=$("#canvas-1").width(),scenejs_canvas_height=$("#canvas-1").height(),$("#canvas-1").width(800),$("#canvas-1").height(800);var a="ws://"+window.location.hostname+":9090";ros=new ROSLIB.Ros({url:a}),console.log("ROS: Connecting to "+a);var b=new ROSLIB.Topic({ros:ros,name:"/ed/gui/entities",messageType:"ed_gui_server/EntityInfos"});b.subscribe(function(a){edUpdate(a)}),clientQueryMeshes=new ROSLIB.Service({ros:ros,name:"/ed/gui/query_meshes",serviceType:"ed_gui_server/QueryMeshes"}),clientInteract=new ROSLIB.Service({ros:ros,name:"/ed/gui/interact",serviceType:"ed_gui_server/Interact"})});