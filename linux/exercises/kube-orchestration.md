<html>
<head>
    <title></title>
    <link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>
    <link href="../../app.css" rel="stylesheet" >
</head>
<body>
    <nav class="navbar navbar-default">
    <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="../../index.html"><img class="logo" src="https://www.docker.com/sites/all/themes/docker/assets/images/brand-full.svg" alt="Docker" title="Docker"/></a>
        </div>
    </div><!-- /.container-fluid -->
    </nav>
    <div class="container">
    <div class="row">
        <h1></h1>
        <div class="content">
            <h1 id="kubernetes-orchestration">Kubernetes Orchestration</h1>
<p>You have been given 3 VMs called <code>node-[0,1,2]</code>. On these nodes we&#39;re going to create a Kubernetes cluster, and declare some basic orchestration objects. Note that some of these examples have been adapted from <a href="https://kubernetes.io/docs">https://kubernetes.io/docs</a>; see Kube&#39;s docs for much more information.</p>
<h2 id="initializing-the-cluster">Initializing the Cluster</h2>
<ol>
<li><p>SSH into <code>node-0</code>. We&#39;ll use this node as our cluster master; follow these steps <strong>only</strong> on <code>node-0</code>.</p>
</li>
<li><p>Initialize the cluster with <code>kubeadm</code>:</p>
<pre><code class="lang-bash">$ sudo kubeadm init --pod-network-cidr=192.168.0.0/16
</code></pre>
<p>The output of this command will look similar to this:</p>
<pre><code class="lang-bash">[init] Using Kubernetes version: v1.10.2
[init] Using Authorization modes: [Node RBAC]
[preflight] Running pre-flight checks.
    [WARNING SystemVerification]: docker version is greater than the most recently validated version. Docker version: 17.06.2-ee-10. Max validated version: 17.03
    [WARNING FileExisting-crictl]: crictl not found in system path
Suggestion: go get github.com/kubernetes-incubator/cri-tools/cmd/crictl
[certificates] Generated ca certificate and key.
[certificates] Generated apiserver certificate and key.
[certificates] apiserver serving cert is signed for DNS names [node-1 kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 10.10.29.54]
[certificates] Generated apiserver-kubelet-client certificate and key.
[certificates] Generated etcd/ca certificate and key.
[certificates] Generated etcd/server certificate and key.
[certificates] etcd/server serving cert is signed for DNS names [localhost] and IPs [127.0.0.1]
[certificates] Generated etcd/peer certificate and key.
[certificates] etcd/peer serving cert is signed for DNS names [node-1] and IPs [10.10.29.54]
[certificates] Generated etcd/healthcheck-client certificate and key.
[certificates] Generated apiserver-etcd-client certificate and key.
[certificates] Generated sa key and public key.
[certificates] Generated front-proxy-ca certificate and key.
[certificates] Generated front-proxy-client certificate and key.
[certificates] Valid certificates and keys now exist in &quot;/etc/kubernetes/pki&quot;
[kubeconfig] Wrote KubeConfig file to disk: &quot;/etc/kubernetes/admin.conf&quot;
[kubeconfig] Wrote KubeConfig file to disk: &quot;/etc/kubernetes/kubelet.conf&quot;
[kubeconfig] Wrote KubeConfig file to disk: &quot;/etc/kubernetes/controller-manager.conf&quot;
[kubeconfig] Wrote KubeConfig file to disk: &quot;/etc/kubernetes/scheduler.conf&quot;
[controlplane] Wrote Static Pod manifest for component kube-apiserver to &quot;/etc/kubernetes/manifests/kube-apiserver.yaml&quot;
[controlplane] Wrote Static Pod manifest for component kube-controller-manager to &quot;/etc/kubernetes/manifests/kube-controller-manager.yaml&quot;
[controlplane] Wrote Static Pod manifest for component kube-scheduler to &quot;/etc/kubernetes/manifests/kube-scheduler.yaml&quot;
[etcd] Wrote Static Pod manifest for a local etcd instance to &quot;/etc/kubernetes/manifests/etcd.yaml&quot;
[init] Waiting for the kubelet to boot up the control plane as Static Pods from directory &quot;/etc/kubernetes/manifests&quot;.
[init] This might take a minute or longer if the control plane images have to be pulled.
[apiclient] All control plane components are healthy after 28.007434 seconds
[uploadconfig] Storing the configuration used in ConfigMap &quot;kubeadm-config&quot; in the &quot;kube-system&quot; Namespace
[markmaster] Will mark node node-1 as master by adding a label and a taint
[markmaster] Master node-1 tainted and labelled with key/value: node-role.kubernetes.io/master=&quot;&quot;
[bootstraptoken] Using token: wdytg5.q1w1f4dau7u6wk11
[bootstraptoken] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstraptoken] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstraptoken] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstraptoken] Creating the &quot;cluster-info&quot; ConfigMap in the &quot;kube-public&quot; namespace
[addons] Applied essential addon: kube-dns
[addons] Applied essential addon: kube-proxy

Your Kubernetes master has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run &quot;kubectl apply -f [podnetwork].yaml&quot; with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join 10.10.29.54:6443 --token wdytg5.q1w1f4dau7u6wk11 --discovery-token-ca-cert-hash sha256:a3b222227e5b064d498321d1838ee271355aae810f7ef1c984f4304e68143c81
</code></pre>
<p>Please note the <strong>join</strong> command at the end of the output. You need this to join your other nodes to the cluster. Thus copy it to a safe place.</p>
</li>
<li><p>To start using your cluster, you need to run (as a regular user):</p>
<pre><code class="lang-bash">$ mkdir -p $HOME/.kube
$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config
</code></pre>
</li>
<li><p>Now list all your nodes in the cluster:</p>
<pre><code class="lang-bash">$ kubectl get nodes
</code></pre>
<p>which should give you something like this:</p>
<pre><code class="lang-bash">NAME      STATUS     ROLES     AGE       VERSION
node-0    NotReady   master    19m       v1.10.2
</code></pre>
<p>The <code>NotReady</code> status for our node indicates that we must install a network for our cluster.</p>
</li>
</ol>
<ol>
<li><p>Install the Calico network driver:</p>
<pre><code class="lang-bash">$ kubectl apply -f https://bit.ly/2KXLghE
</code></pre>
</li>
<li><p>After a moment our node should now be ready:</p>
<pre><code class="lang-bash">$ kubectl get nodes -w
NAME      STATUS     ROLES     AGE       VERSION
node-0    NotReady   master    1m        v1.10.2
node-0    NotReady   master    1m        v1.10.2
node-0    NotReady   master    1m        v1.10.2
node-0    Ready     master    2m        v1.10.2
node-0    Ready     master    2m        v1.10.2
</code></pre>
</li>
</ol>
<h2 id="joining-nodes-to-the-cluster">Joining Nodes to the Cluster</h2>
<ol>
<li>SSH into <code>node-1</code> and <code>node-2</code> and paste in the <code>kubeadm join...</code> command you found in step 2 above; you&#39;ll need to run this as <code>sudo</code>.</li>
</ol>
<h2 id="verifying-the-cluster">Verifying the Cluster</h2>
<ol>
<li><p>On the master execute:</p>
<pre><code class="lang-bash">$ kubectl get nodes
</code></pre>
<p>and you should get something like this:</p>
<pre><code class="lang-bash">NAME      STATUS    ROLES     AGE       VERSION
node-0    Ready     master    9m        v1.10.2
node-1    Ready     &lt;none&gt;    1m        v1.10.2
node-2    Ready     &lt;none&gt;    58s       v1.10.2
</code></pre>
<p>here we have a 3 node cluster with 1 master and two worker nodes.</p>
</li>
<li><p>Let&#39;s see what system pods are running on our cluster:</p>
<pre><code class="lang-bash">$ kubectl get pods -n kube-system
</code></pre>
<p>which results in something similar to this:</p>
<pre><code class="lang-bash">NAME                             READY     STATUS    RESTARTS   AGE
calico-etcd-k56v8                          1/1       Running   0          8m
calico-kube-controllers-685755779f-vk229   1/1       Running   0          8m
calico-node-k6skf                          2/2       Running   0          1m
calico-node-lkp5c                          2/2       Running   0          8m
calico-node-t28hm                          2/2       Running   1          1m
etcd-node-0                                1/1       Running   0          8m
kube-apiserver-node-0                      1/1       Running   0          8m
kube-controller-manager-node-0             1/1       Running   0          8m
kube-dns-86f4d74b45-nqkx4                  3/3       Running   0          9m
kube-proxy-j2xjd                           1/1       Running   0          9m
kube-proxy-spksv                           1/1       Running   0          1m
kube-proxy-wpfl5                           1/1       Running   0          1m
kube-scheduler-node-0                      1/1       Running   0          8m
</code></pre>
<p>We can see the pods running on the master: etcd, api-server, controller manager and scheduler. We can also see that the <code>dns</code> service and the <code>proxy</code> and calico components run on each member of the cluster as expected.</p>
<p>Also note that e.g. the DNS service has 3/3 in the READY column. This means that the DNS pod contains 3 containers of which all 3 are ready. Similarly the calico node pods have two each, one for each node.</p>
</li>
</ol>
<h2 id="creating-pods">Creating Pods</h2>
<ol>
<li><p>On your master node, create a yaml file <code>pod.yaml</code> to describe a simple pod with the following content:</p>
<pre><code class="lang-yaml">apiVersion: v1
kind: Pod
metadata:
  name: demo
spec:
  containers:
  - name: nginx
    image: nginx:1.7.9
</code></pre>
</li>
<li><p>Deploy your pod:</p>
<pre><code class="lang-bash">$ kubectl create -f pod.yaml
</code></pre>
</li>
<li><p>Confirm your pod is running:</p>
<pre><code class="lang-bash">$ kubectl get pod demo
</code></pre>
</li>
<li><p>Get some metadata about your pod:</p>
<pre><code class="lang-bash">$ kubectl describe pod demo
</code></pre>
</li>
<li><p>Delete your pod:</p>
<pre><code class="lang-bash">$ kubectl delete pod demo
</code></pre>
</li>
<li><p>Modify <code>pod.yaml</code> to create a second container inside your pod:</p>
<pre><code class="lang-yaml">apiVersion: v1
kind: Pod
metadata:
  name: demo
spec:
  containers:
  - name: nginx
    image: nginx:1.7.9
  - name: sidecar
    image: centos:7
    command: [&quot;ping&quot;]
    args: [&quot;8.8.8.8&quot;]
</code></pre>
</li>
<li><p>Deploy this new pod, and create a bash shell inside the container named <code>sidecar</code>:</p>
<pre><code class="lang-bash">$ kubectl create -f pod.yaml
$ kubectl exec -c=sidecar -it demo -- /bin/bash
</code></pre>
</li>
<li><p>From within the <code>sidecar</code> container, fetch the nginx landing page on the default port 80 using <code>localhost</code>:</p>
<pre><code class="lang-bash">$ curl localhost:80
</code></pre>
<p>You should see the html of the nginx landing page. Note <strong>these containers can reach each other on localhost</strong>, meaning they are sharing a network namespace. Now list the processes in your <code>sidecar</code> conainer:</p>
<pre><code class="lang-bash">$ ps -aux
</code></pre>
<p>You should see the <code>ping</code> process we containerized, the shell we created to explore this container using <code>kubectl exec</code>, and the <code>ps</code> process itself - but no <code>nginx</code>. While a network namespace is shared between the containers, they still have their own PID namespace (for example).</p>
</li>
<li><p>Finally, remember to exit out of this pod, and delete it:</p>
<pre><code class="lang-bash">$ exit
$ kubectl delete pod demo
</code></pre>
</li>
</ol>
<h2 id="creating-replicasets">Creating ReplicaSets</h2>
<ol>
<li><p>On your master node, create a yaml file <code>replicaset.yaml</code> to describe a simple replicaSet with the following content:</p>
<pre><code class="lang-yaml">apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: rs-demo
spec:
  replicas: 3
  selector:
    matchLabels:
      component: reverse-proxy
  template:
    metadata:
      labels:
        component: reverse-proxy
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
</code></pre>
<p>Notice especially the <code>replicas</code> key, which defines how many copies of this pod to create, and the <code>template</code> section; this defines the pod to replicate, and is described almost exactly like the first pod definition we created above. The difference here is the required presence of the <code>labels</code> key in the pod&#39;s metadata, which must match the <code>selector -&gt; matchLabels</code> item in the specification of the replicaSet.</p>
</li>
<li><p>Deploy your replicaSet, and get some state information about it:</p>
<pre><code class="lang-bash">$ kubectl create -f replicaset.yaml
$ kubectl describe replicaset rs-demo
</code></pre>
<p>After a few moments, you should see something like</p>
<pre><code class="lang-bash">Name:         rs-demo
Namespace:    default
Selector:     component=reverse-proxy
Labels:       component=reverse-proxy
Annotations:  &lt;none&gt;
Replicas:     3 current / 3 desired
Pods Status:  3 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:  component=reverse-proxy
  Containers:
   nginx:
    Image:        nginx:1.7.9
    Port:         &lt;none&gt;
    Host Port:    &lt;none&gt;
    Environment:  &lt;none&gt;
    Mounts:       &lt;none&gt;
  Volumes:        &lt;none&gt;
Events:
  Type    Reason            Age   From                   Message
  ----    ------            ----  ----                   -------
  Normal  SuccessfulCreate  35s   replicaset-controller  Created pod: rs-demo-jxmjj
  Normal  SuccessfulCreate  35s   replicaset-controller  Created pod: rs-demo-dmdtf
  Normal  SuccessfulCreate  35s   replicaset-controller  Created pod: rs-demo-j62fx
</code></pre>
<p>Note the replicaSet has created three pods as requested, and will reschedule them if they exit.</p>
</li>
<li><p>Try killing off one of your pods, and reexamining the output of the above <code>describe</code> command. The <code>&lt;pod name&gt;</code> comes from the last three lines in the output above, such as <code>rs-demo-jxmjj</code>:</p>
<pre><code class="lang-bash">$ kubectl delete pod &lt;pod name&gt;
$ kubectl describe replicaset rs-demo
</code></pre>
<p>The dead pod gets rescheduled by the replicaSet, similar to a failed task in Docker Swarm.</p>
</li>
<li><p>Delete your replicaSet:</p>
<pre><code class="lang-bash">$ kubectl delete replicaset rs-demo
</code></pre>
</li>
</ol>
<h2 id="creating-deployments">Creating Deployments</h2>
<ol>
<li><p>On your master node, create a yaml file <code>deployment.yaml</code> to describe a simple deployment with the following content:</p>
<pre><code class="lang-yaml">apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
</code></pre>
<p>Notice this is the exact same structure as your replicaSet yaml above, but this time the <code>kind</code> is <code>Deployment</code>. </p>
</li>
<li><p>Spin up your deployment, and get some state information:</p>
<pre><code class="lang-bash">$ kubectl create -f deployment.yaml
$ kubectl describe deployment nginx-deployment
</code></pre>
<p>The <code>describe</code> command should return something like:</p>
<pre><code class="lang-bash">Name:                   nginx-deployment
Namespace:              default
CreationTimestamp:      Thu, 24 May 2018 04:29:18 +0000
Labels:                 &lt;none&gt;
Annotations:            deployment.kubernetes.io/revision=1
Selector:               app=nginx
Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=nginx
  Containers:
   nginx:
    Image:        nginx:1.7.9
    Port:         &lt;none&gt;
    Host Port:    &lt;none&gt;
    Environment:  &lt;none&gt;
    Mounts:       &lt;none&gt;
  Volumes:        &lt;none&gt;
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    NewReplicaSetAvailable
OldReplicaSets:  &lt;none&gt;
NewReplicaSet:   nginx-deployment-85f7784776 (3/3 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  10s   deployment-controller  Scaled up replica set nginx-deployment-85f7784776 to 3
</code></pre>
<p>Note the very last line, indicating this deployment actually created a replicaSet which it used to scale up to three pods.</p>
</li>
<li><p>List your replicaSets and pods:</p>
<pre><code class="lang-bash">$ kubectl get replicaSet
$ kubectl get pod
</code></pre>
<p>You should see one replicaSet and three pods created by your deployment.</p>
</li>
<li><p>Upgrade the nginx image from <code>1.7.9</code> to <code>1.9.1</code>:</p>
<pre><code class="lang-bash">$ kubectl set image deployment/nginx-deployment nginx=nginx:1.9.1
</code></pre>
</li>
<li><p>After a few seconds, <code>kubectl describe</code> your deployment as above again. You should see that the image has been updated, and that the old replicaSet has been scaled down and replaced with a new one. List your replicaSets one more time:</p>
<pre><code class="lang-bash">$ kubectl get replicaSets
</code></pre>
<p>You should see something like</p>
<pre><code class="lang-bash">NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-69df9ccbf8   3         3         3         4m
nginx-deployment-85f7784776   0         0         0         9m
</code></pre>
<p>Do a <code>kubectl describe replicaSet &lt;replicaSet scaled down to 0&gt;</code>; you should see that while no pods are running for this replicaSet, the old replicaSet&#39;s definition is still around so we can easily roll back to this version of the app if we need to.</p>
</li>
<li><p>Clean up your cluster:</p>
<pre><code class="lang-bash">$ kubectl delete deployment nginx-deployment
</code></pre>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, you explored the basic scheduling objects of pods, replicaSets, and deployments. Each object is responsible for a different part of the orchestration stack; pods are the basic unit of scheduling, replicaSets do keep-alive and scaling, and deployments provide update and rollback functionality. In a sense, these objects all &#39;nest&#39; one inside the next; by creating a deployment, you implicity created a replicaSet which in turn created the corresponding pods. In most cases, you&#39;re better off creating deployments rather than replicaSets or pods directly; this way, you get all the orchestrating scheduling features you would expect in analogy to a Docker swarm service.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>