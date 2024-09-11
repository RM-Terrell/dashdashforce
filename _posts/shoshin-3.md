---
title: "Shoshin 3: Sometimes walking backwards is better than forwards"
excerpt: "...or I could just do that."
coverImage: "/assets/blog/shoshin-3/bear_peak.jpg"
date: "2022-04-12"
tags: [kubernetes, shoshin]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/shoshin-3/bear_peak.jpg"
---

Sometimes it helps to think things through backwards. As part of testing a new feature I was working on at work I needed to create a new Kubernetes Storage Class (SC) for a particular cluster and run some apps off of it. Storage classes for use with the applications I was looking to test of course had particular requirements for provisioners, reclaim policies, etc, and initially I was unsure how I needed to configure these things for my use case.

It was an initially daunting thought to work through each field of the SC yaml files fields and the corresponding Kubernetes docs, to build the SC, along with potentially doing some trial and error creating and destroying it to get it all right, which is how I had been doing things up to that point. That is until one of my coworkers blew my mind by simply saying

> Well you could just describe one the other existing SC's already on your test server that you know works

...or I could just do that.

```bash
kubectl get storageclass <existing_default_sc> -o yaml
```

The above command dumped out a yaml file with all the settings I needed for that unique cluster, except for changing the name of it to create a new one.

```yaml
storage class:
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: test-sc 
provisioner: <our_provisioner>
allowVolumeExpansion: True
volumeBindingMode: Immediate
reclaimPolicy: Delete
parameters:
  backendType: <our_backend_type>
  media: ssd
  <more parameters>
```

Easy. Sometimes it pays to think through a problem in a different direction than you usually do, especially so with Kubernetes as the `get` and `describe` features can be leveraged this way for a lot more than just SC's and thus allow you to reverse engineer how a particular cluster is working.

Happy pod wrangling.
