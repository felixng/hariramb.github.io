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
            <h1 id="starting-a-service">Starting a Service</h1>
<p>So far, we&#39;ve set up a four-node swarm with three managers. In order to use a swarm to actually execute anything, we have to define <em>services</em> for that swarm to run; services are the fundamental logical entity that users interact with in a distributed application engineering environment, while things like individual processes or containers are handled by the swarm scheduler. Similarly, the scheduler handles routing tasks to specific nodes, so the user can approach the swarm as a whole without explicitly interacting with individual nodes.</p>
<h2 id="creating-an-overlay-network-and-service">Creating an Overlay Network and Service</h2>
<ol>
<li><p>Create a multi-host overlay network to connect your service to:</p>
<pre><code class="lang-bash">$ docker network create --driver overlay my_overlay
</code></pre>
</li>
<li><p>Create a service featuring an <code>alpine</code> container pinging Google resolvers, plugged into your overlay network:</p>
<pre><code class="lang-bash">$ docker service create --name pinger --network my_overlay alpine ping 8.8.8.8
</code></pre>
<p>Note the syntax is a lot like <code>docker container run</code>; an image (<code>alpine</code>) is specified, followed by the PID 1 process for that container (<code>ping 8.8.8.8</code>).</p>
</li>
<li><p>Get some information about the currently running services:</p>
<pre><code class="lang-bash">$ docker service ls
</code></pre>
</li>
<li><p>Check which node the container was created on:</p>
<pre><code class="lang-bash">$ docker service ps pinger
</code></pre>
</li>
<li><p>SSH into the node you found in the last step, find the container ID with <code>docker container ls</code>, and check its logs with <code>docker container logs &lt;container ID&gt;</code>. The results of the ongoing ping should be visible.</p>
</li>
<li><p>Inspect the <code>my_overlay</code> network on the current node:</p>
<pre><code class="lang-bash">$ docker network inspect my_overlay
</code></pre>
<p>You should be able to see the container connected to this network, and a list of swarm nodes connected to this network under the <code>Peers</code> key. Also notice the correspondence between the container IPs and the subnet assigned to the network under the <code>IPAM</code> key - this is the subnet from which container IPs on this network are drawn.</p>
</li>
<li><p>Connect to a <strong>worker</strong> node that does not have a container running from your <code>pinger</code> service, and list the networks on this machine:</p>
<pre><code class="lang-bash">$ docker network ls
</code></pre>
<p><code>my_overlay</code> does not appear. If you don&#39;t have a worker node not running a container for this service, try rebooting a worker that does (<code>sudo reboot now</code>). The container will get re-scheduled somewhere else, and when the worker comes back up you&#39;ll be able to see the above behavior.</p>
</li>
<li><p>Connect to a <strong>manager</strong> node and list the networks again. This time you will be able to see the network <em>whether or not</em> this manager has a container running on it for your <code>pinger</code> service; all managers maintain knowledge of all overlay networks.</p>
</li>
<li><p>On the same manager, inspect the <code>my_overlay</code> network again. If this manager does happen to have a container for the service scheduled on it, you&#39;ll be able to see the <code>Peers</code> list like above; if there is no container scheduled for the service on this node, the <code>Peers</code> list will be empty. <code>Peers</code> are maintained by Swarm&#39;s gossip control plane, which is scoped to only include nodes with running containers attached to the same overlay network.</p>
</li>
</ol>
<h2 id="scaling-a-service">Scaling a Service</h2>
<ol>
<li><p>Back on a manager node, scale up the number of concurrent tasks that our <code>alpine</code> service is running:</p>
<pre><code class="lang-bash">$ docker service update pinger --replicas=8
</code></pre>
</li>
<li><p>Now run <code>docker service ps pinger</code> to inspect the service. Are all the containers running right away? How were they distributed across your swarm?</p>
</li>
<li><p>Use <code>docker network inspect my_overlay</code> again on a node that has a <code>pinger</code> container running. More nodes appear connected to this network under the <code>Peers</code> key.</p>
</li>
</ol>
<h2 id="inspecting-service-logs">Inspecting Service Logs</h2>
<ol>
<li><p>In a previous step, you looked at the container logs for an individual task in your service; manager nodes can assemble all logs for all tasks of a given service by doing:</p>
<pre><code class="lang-bash">$ docker service logs pinger
</code></pre>
</li>
<li><p>If instead you&#39;d like to see the logs of a single task, on a manager node run <code>docker service ps pinger</code>, choose any task ID, and run <code>docker service logs &lt;task ID&gt;</code>. The logs of the individual task are returned; compare this to what you did above to fetch the same information with <code>docker container logs</code>.</p>
</li>
</ol>
<h2 id="scheduling-topology-aware-services">Scheduling Topology-Aware Services</h2>
<p>By default, the Swarm scheduler will spread containers across nodes based on availability, but in practice it is wise to consider datacenter segmentation; spreading tasks across datacenters or availability zones keeps the service available even when one such segement goes down.</p>
<ol>
<li><p>Add a label <code>datacenter</code> with value <code>east</code> to two nodes of your swarm:</p>
<pre><code class="lang-bash">$ docker node update --label-add datacenter=east node-0
$ docker node update --label-add datacenter=east node-1
</code></pre>
</li>
<li><p>Add a label <code>datacenter</code> with value <code>west</code> to the other two nodes:</p>
<pre><code class="lang-bash">$ docker node update --label-add datacenter=west node-2
$ docker node update --label-add datacenter=west node-3
</code></pre>
</li>
<li><p>Create a service using the <code>--placement-pref</code> flag to spread across node labels:</p>
<pre><code class="lang-bash">$ docker service create --name my_proxy --replicas=2 --publish 8000:80 \
    --placement-pref spread=node.labels.datacenter \
    nginx
</code></pre>
<p>There should be <code>nginx</code> containers present on nodes with every possible value of the <code>node.labels.datacenter</code> label.</p>
</li>
<li><p>Use <code>docker service ps...</code> as above to check that replicas got spread across the datacenter labels.</p>
</li>
</ol>
<h2 id="using-a-few-flags">Using a few flags</h2>
<ol>
<li><p>If a container doesn&#39;t need to write to its filesystem, it should <em>always</em> be run in read-only mode, for security purposes. Update your service to use read-only containers:</p>
<pre><code class="lang-bash">$ docker service update pinger --read-only
</code></pre>
<p>Try connecting to the container and creating a file to convince yourself this worked as expected.</p>
</li>
<li><p>When starting a service based on an image with a pre-defined <code>ENTRYPOINT</code>, issuing the command to run after the image name as above won&#39;t work. Override any existing <code>ENTRYPOINT</code> with the <code>--entrypoint</code> flag:</p>
<pre><code class="lang-bash">$ docker service create --entrypoint &quot;ping 8.8.8.8&quot; alpine
</code></pre>
</li>
<li><p>Services by default start in the background, but can be started in synchronous mode instead with the <code>--detach=false</code> flag. See this in action:</p>
<pre><code class="lang-bash">$ docker service create --detach=false \
  --replicas 5 \
  busybox top
</code></pre>
</li>
</ol>
<h2 id="cleanup">Cleanup</h2>
<ol>
<li><p>Remove all existing services, in preparation for future exercises:</p>
<pre><code class="lang-bash">$ docker service rm $(docker service ls -q)
</code></pre>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>In this example, we saw the basic syntax for defining a service based on an image, and for changing the number of replicas, or concurrent containers, running of that image. We also saw how to investigate the state of services on our swarm with <code>docker service ls</code> and <code>docker service ps</code>, how to fetch logs from a manager node for one or all the tasks in a service using <code>docker service logs</code>, how to ensure containers are scheduled across availability zones, and some particularly useful flags for use with service creation.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>