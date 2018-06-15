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
            <h1 id="kubernetes-networking">Kubernetes Networking</h1>
<h2 id="routing-traffic-with-calico">Routing Traffic with Calico</h2>
<ol>
<li><p>Make sure you&#39;re on the master node <code>node-0</code>, and redeploy the nginx deployment defined in <code>deployment.yaml</code> from the last exercise.</p>
</li>
<li><p>List your pods:</p>
<pre><code class="lang-bash">$ kubectl get pods
</code></pre>
</li>
<li><p>Get some metadata on one of the pods found in the last step:</p>
<pre><code class="lang-bash">$ kubectl describe pods &lt;pod name&gt;
</code></pre>
<p>which in my case results in:</p>
<pre><code class="lang-bash">Name:           nginx-65899c769f-qbx8h
Namespace:      default
Node:           node-2/10.10.52.135
Start Time:     Wed, 09 May 2018 13:55:46 +0000
Labels:         pod-template-hash=2145573259
                run=nginx
Annotations:    &lt;none&gt;
Status:         Running
IP:             192.168.139.65
Controlled By:  ReplicaSet/nginx-65899c769f
Containers:
  nginx:
    Container ID:   docker://605873dcb7cb5e0c3944669f0e5f5024d0f70ff3bd58de64d4a070088a2f4073
    Image:          nginx
    Image ID:       docker-pullable://nginx@sha256:0fb320e2a1b1620b4905facb3447e3d84ad36da0b2c8aa8fe3a5a81d1187b884
    Port:           &lt;none&gt;
    Host Port:      &lt;none&gt;
    State:          Running
      Started:      Wed, 09 May 2018 13:55:51 +0000
    Ready:          True
    Restart Count:  0
    Environment:    &lt;none&gt;
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-f4sxm (ro)
Conditions:
  Type           Status
  Initialized    True 
  Ready          True 
  PodScheduled   True 
Volumes:
  default-token-f4sxm:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-f4sxm
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  &lt;none&gt;
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type    Reason                 Age   From               Message
  ----    ------                 ----  ----               -------
  Normal  Scheduled              41s   default-scheduler  Successfully assigned nginx-65899c769f-qbx8h to node-2
  Normal  SuccessfulMountVolume  41s   kubelet, node-2    MountVolume.SetUp succeeded for volume &quot;default-token-f4sxm&quot;
  Normal  Pulling                40s   kubelet, node-2    pulling image &quot;nginx&quot;
  Normal  Pulled                 36s   kubelet, node-2    Successfully pulled image &quot;nginx&quot;
  Normal  Created                36s   kubelet, node-2    Created container
  Normal  Started                36s   kubelet, node-2    Started container
</code></pre>
<p>We can see that in our case the pod has been deployed to <code>node-2</code> as indicated in the third line of the output, and the pod has an IP of <code>192.168.139.65</code>.</p>
</li>
<li><p>Have a look at the routing table on <code>node-0</code> using <code>ip route</code>, which for my example looks like:</p>
<pre><code class="lang-bash">$ ip route
default via 10.10.16.1 dev eth0 
10.10.16.0/20 dev eth0  proto kernel  scope link  src 10.10.29.54 
172.17.0.0/16 dev docker0  proto kernel  scope link  src 172.17.0.1 
blackhole 192.168.84.128/26  proto bird 
192.168.84.129 dev cali1fe2e82cb86  scope link 
192.168.139.64/26 via 10.10.52.135 dev tunl0  proto bird onlink 
192.168.247.0/26 via 10.10.41.16 dev tunl0  proto bird onlink
</code></pre>
<p>Notice the second-to-last line; this rule was written by Calico to send any traffic on the 192.168.139.64/26 subnet to the host at IP 10.10.52.135 via IP in IP as indicated by the <code>dev tunl0</code> entry. Look at your list of VM IPs; which host does this correspond to? Does that make sense based on the host you found for the nginx pod above?</p>
</li>
<li><p>Curl your pod&#39;s IP on port 80 from <code>node-0</code>; you should see the HTML for the nginx landing page. By default this pod is reachable at this IP from anywhere in the Kubernetes cluster.</p>
</li>
<li><p>Head over to the node this pod got scheduled on (<code>node-2</code> in the example above), and have a look at that host&#39;s routing table in the same way:</p>
<pre><code class="lang-bash">$ ip route
default via 10.10.48.1 dev eth0 
10.10.48.0/20 dev eth0  proto kernel  scope link  src 10.10.52.135 
172.17.0.0/16 dev docker0  proto kernel  scope link  src 172.17.0.1 
192.168.84.128/26 via 10.10.29.54 dev tunl0  proto bird onlink 
blackhole 192.168.139.64/26  proto bird 
192.168.139.65 dev cali521ad2fc572  scope link 
192.168.247.0/26 via 10.10.41.16 dev tunl0  proto bird onlink
</code></pre>
<p>Again notice the second-to-last line; this time, the pod IP is routed to a <code>cali***</code> device, which is a virtual ethernet endpoint in the host&#39;s network namespace, providing a point of ingress into that pod. Once again try <code>curl &lt;pod IP&gt;:80</code> - you&#39;ll see the nginx landing page html as before.</p>
</li>
<li><p>Back on <code>node-0</code>, fetch the logs generated by the pod you&#39;ve been curling:</p>
<pre><code class="lang-bash">$ kubectl logs &lt;pod name&gt;
10.10.52.135 - - [09/May/2018:13:58:42 +0000] &quot;GET / HTTP/1.1&quot; 200 612 &quot;-&quot; &quot;curl/7.29.0&quot; &quot;-&quot;
192.168.84.128 - - [09/May/2018:14:00:41 +0000] &quot;GET / HTTP/1.1&quot; 200 612 &quot;-&quot; &quot;curl/7.29.0&quot; &quot;-&quot;
</code></pre>
<p>We see records of the curls we preformed above; like Docker containers, these logs are the STDOUT and STDERR of the containerized processes.</p>
</li>
</ol>
<h2 id="routing-and-load-balancing-with-services">Routing and Load Balancing with Services</h2>
<ol>
<li><p>Above we were able to hit nginx at the pod IP, but there is no guarantee this pod won&#39;t get rescheduled to a new IP. If we want a stable IP for this deployment, we need to create a <code>ClusterIP</code> service. In a file <code>cluster.yaml</code> on your master node:</p>
<pre><code class="lang-yaml">apiVersion: v1
kind: Service
metadata:
  name: cluster-demo
spec:
  selector:
    app: nginx
  ports:
  - port: 8080
    targetPort: 80
</code></pre>
<p>And create this service with <code>kubectl create -f cluster.yaml</code>. This maps the pod internal port 80 to the cluster wide external port 8080; furthermore, this IP and port will only be reachable from <em>within</em> the cluster.</p>
</li>
<li><p>Let&#39;s see what services we have now:</p>
<pre><code class="lang-bash">$ kubectl get services
NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
kubernetes     ClusterIP   10.96.0.1       &lt;none&gt;        443/TCP    33m
cluster-demo   ClusterIP   10.104.201.93   &lt;none&gt;        8080/TCP   48s
</code></pre>
<p>The second one is the one we just created and we can see that a stable IP address and port <code>10.104.201.93:8080</code> has been assigned to our <code>nginx</code> service. </p>
</li>
<li><p>Let&#39;s try to access Nginx now, from any node in our cluster:</p>
<pre><code class="lang-bash">$ curl &lt;nginx CLUSTER-IP&gt;:8080
</code></pre>
<p>which should return the Nginx welcome page. Even if pods get rescheduled to new IPs, this clusterIP service will preserve a stable entrypoint for traffic to be load balanced across all pods matching the service&#39;s label selector.</p>
</li>
<li><p>ClusterIP services are reachable only from within the Kubernetes cluster. If you want to route traffic to your pods from an external network, you&#39;ll need a NodePort service. On your master node, create a file <code>nodeport.yaml</code>:</p>
<pre><code class="lang-yaml">apiVersion: v1
kind: Service
metadata:
  name: nodeport-demo
spec:
  type: NodePort
  selector:
      app: nginx
  ports:
  - port: 8080
    targetPort: 80
</code></pre>
<p>And create this service with <code>kubectl create -f nodeport.yaml</code>. Notice this is exactly the same as the ClusterIP service definition, but now we&#39;re requesting a type NodePort. </p>
</li>
<li><p>Inspect this service&#39;s metadata:</p>
<pre><code class="lang-bash">$ kubectl describe service nodeport-demo
</code></pre>
<p>Notice the NodePort field: this is a randomly selected port from the range 30000-32767 where your pods will be reachable externally. Try visiting your nginx deployment at any public IP of your cluster, and the port you found above, and confirming you can see the nginx landing page.</p>
</li>
</ol>
<ol>
<li><p>Clean up the objects you created in this section:</p>
<pre><code class="lang-bash">$ kubectl delete deployment nginx-deployment
$ kubectl delete service cluster-demo
$ kubectl delete service nodeport-demo
</code></pre>
</li>
</ol>
<h2 id="optional-deploying-dockercoins-onto-the-kubernetes-cluster">Optional: Deploying DockerCoins onto the Kubernetes Cluster</h2>
<ol>
<li><p>First deploy Redis via <code>kubectl run</code>:</p>
<pre><code class="lang-bash">$ kubectl run redis --image=redis
</code></pre>
</li>
<li><p>And now all the other deployments. To avoid too much typing we do that in a loop:</p>
<pre><code class="lang-bash">$ export USER=&lt;Docker ID&gt;
$ for DEPLOYMENT in hasher rng webui worker; do
    kubectl run $DEPLOYMENT --image=${USER}/dockercoins_${DEPLOYMENT}:1.0
done
</code></pre>
</li>
<li><p>Let&#39;s see what we have:</p>
<pre><code class="lang-bash">$ kubectl get pods -o wide -w
</code></pre>
<p>in my case the result is:</p>
<pre><code class="lang-bash">hasher-6c64f78655-rgjk5   1/1       Running   0          53s       10.36.0.1   node-2
redis-75586d7d7c-mmjg7    1/1       Running   0          5m        10.44.0.2   node-1
rng-d94d56d4f-twlwz       1/1       Running   0          53s       10.44.0.1   node-1
webui-6d8668984d-sqtt8    1/1       Running   0          52s       10.36.0.2   node-2
worker-56756ddbb8-lbv9r   1/1       Running   0          52s       10.44.0.3   node-1
</code></pre>
<p>the applications/services have been nicely distributed to the two worker nodes.</p>
</li>
<li><p>We can also look at some logs:</p>
<pre><code class="lang-bash">$ kubectl logs deploy/rng
$ kubectl logs deploy/worker
</code></pre>
<p>The <code>rng</code> service (and also the <code>hasher</code> and <code>webui</code> services) seem to work fine but the <code>worker</code> service reports errors. The reason is that unlike on Swarm, Kubernetes does not automatically provide a stable networking endpoint for deployments. We need to create at least a <code>ClusterIP</code> service for each of our deployments so they can communicate.</p>
</li>
<li><p>List your current services:</p>
<pre><code class="lang-bash">$ kubectl get services
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    &lt;none&gt;        443/TCP   46m
</code></pre>
</li>
<li><p>Expose the <code>redis</code>, <code>rng</code> and <code>hasher</code> <strong>internally</strong> using services and specifying the correct (internal) port:</p>
<pre><code class="lang-bash">$ kubectl expose deployment redis --port 6379
$ kubectl expose deployment rng --port 80
$ kubectl expose deployment hasher --port 80
</code></pre>
</li>
<li><p>List your services again:</p>
<pre><code class="lang-bash">$ kubectl get services
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
hasher       ClusterIP   10.108.207.22    &lt;none&gt;        80/TCP     20s
kubernetes   ClusterIP   10.96.0.1        &lt;none&gt;        443/TCP    47m
redis        ClusterIP   10.100.14.121    &lt;none&gt;        6379/TCP   31s
rng          ClusterIP   10.111.235.252   &lt;none&gt;        80/TCP     26s
</code></pre>
<p>Evidently <code>kubectl expose</code> creates <code>ClusterIP</code> services allowing stable, internal reachability for your deployments, much like you did via yaml manifests for your nginx deployment in the last section. See the <code>kubectl</code> api docs for more command-line alternatives to yaml manifests.</p>
</li>
<li><p>Get the logs of the worker again:</p>
<pre><code class="lang-bash">$ kubectl logs deploy/worker
</code></pre>
<p>This time you should see that the <code>worker</code> recovered (give it at least 10 sec to do so). The <code>worker</code> can now access the other services.</p>
</li>
<li><p>Now let&#39;s expose the <code>webui</code> to the public using a service of type <code>NodePort</code>:</p>
<pre><code class="lang-bash">$ kubectl expose deploy/webui --type=NodePort --port 80
</code></pre>
</li>
<li><p>List your services one more time:</p>
<pre><code class="lang-bash">$ kubectl get services
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
hasher       ClusterIP   10.108.207.22    &lt;none&gt;        80/TCP         2m
kubernetes   ClusterIP   10.96.0.1        &lt;none&gt;        443/TCP        49m
redis        ClusterIP   10.100.14.121    &lt;none&gt;        6379/TCP       2m
rng          ClusterIP   10.111.235.252   &lt;none&gt;        80/TCP         2m
webui        NodePort    10.108.88.182    &lt;none&gt;        80:32015/TCP   33s
</code></pre>
<p>Notice the <code>NodePort</code> service created for <code>webui</code>. This type of service provides similar behavior to the Swarm L4 mesh net: a port (32015 in my case) has been reserved across the cluster; any external traffic hitting any cluster IP on that port will be directed to port 80 inside a <code>webui</code> pod.</p>
</li>
<li><p>Visit your Dockercoins web ui at <code>http://&lt;node IP&gt;:&lt;port&gt;</code>, where <code>&lt;node IP&gt;</code> is the public IP address any of your cluster members. You should see the dashboard of our DockerCoins application.</p>
</li>
<li><p>Let&#39;s scale up the worker a bit and see the effect of it:</p>
<pre><code class="lang-bash">$ kubectl scale deploy/worker --replicas=10
</code></pre>
<p>Observe the result of this scaling in the browser. We do not really get a 10-fold increase in throughput, just as when we deployed DockerCoins on swarm; the <code>rng</code> service is causing a bottleneck.</p>
</li>
<li><p>To scale up, we want to run an instance of <code>rng</code> on each node of the cluster. For this we use a <code>DaemonSet</code>. We do this by using a YAML file that captures the desired configuration, rather than through the CLI.</p>
<p>Create a file <code>deploy-rng.yaml</code> as follows:</p>
<pre><code class="lang-bash">$ kubectl get deploy/rng -o yaml --export &gt; deploy-rng.yaml
</code></pre>
<p>Note: <code>--export</code> will remove &quot;cluster-specific&quot; information</p>
</li>
<li><p>Edit this file to make it describe a <code>DaemonSet</code> instead of a <code>Deployment</code>:</p>
<ul>
<li>change <code>kind</code> to <code>DaemonSet</code></li>
<li>remove the <code>progressDeadlineSeconds</code> field</li>
<li>remove the <code>replicas</code> field</li>
<li>remove the <code>strategy</code> block (which defines the rollout mechanism for a deployment)</li>
<li>remove the <code>status: {}</code> line at the end</li>
</ul>
</li>
<li><p>Now apply this YAML file to create the <code>DaemonSet</code>:</p>
<pre><code class="lang-bash">$ kubectl apply -f deploy-rng.yaml
</code></pre>
</li>
<li><p>We can now look at the <code>DaemonSet</code> that was created:</p>
<pre><code class="lang-bash">$ kubectl get daemonset
NAME      DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
rng       2         2         2         2            2           &lt;none&gt;          1m
</code></pre>
<p>Dockercoins performance should now improve, as illustrated by your web ui.</p>
</li>
<li><p>If we do a <code>kubectl get all</code> we will see that we now have both a <code>deploy/rng</code> AND a <code>ds/rng</code>. Deployments are not just converted to Daemon sets. Let&#39;s delete the <code>rng</code> deployment:</p>
<pre><code class="lang-bash">$ kubectl delete deploy/rng
</code></pre>
</li>
<li><p>Clean up your resources when done:</p>
<pre><code class="lang-bash">$ for D in redis hasher rng webui; do kubectl delete svc/$D; done
$ for D in redis hasher webui worker; do kubectl delete deploy/$D; done
$ kubectl delete ds/rng
</code></pre>
</li>
<li><p>Make sure that everything is cleared:</p>
<pre><code class="lang-bash">$ kubectl get all
</code></pre>
<p>should only show the <code>svc/kubernets</code> resource.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, we looked at some of the key Kubernetes service objects that provide routing and load balancing for collections of pods; clusterIP for internal communication, analogos to Swarm&#39;s VIPs, and NodePort, for routing external traffic to an app similarly to Swarm&#39;s L4 mesh net. We also briefly touched on the inner workings of Calico, one of many Kubernetes network plugins and the one that ships natively with Docker&#39;s Enterprise Edition product. The key networking difference between Swarm and Kubernetes is their approach to default firewalling; while Swarm firewalls software defined networks automatically, all pods can reach all other pods on a Kube cluster, in Calico&#39;s case via the BGP-updated control plane and IP-in-IP data plane you explored above.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>