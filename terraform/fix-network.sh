#!/bin/bash
# Fix network connectivity for EC2 instance

INSTANCE_ID="i-0f27800769c36170f"
SG_NAME="react-devops-app-sg"

echo "=== Checking instance details ==="
aws ec2 describe-instances --instance-ids $INSTANCE_ID \
  --query 'Reservations[0].Instances[0].{PublicIp:PublicIpAddress,SecurityGroups:SecurityGroups[*].GroupName,SubnetId:SubnetId}' \
  --output table

echo -e "\n=== Checking security group rules ===" 
SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$SG_NAME" --query 'SecurityGroups[0].GroupId' --output text)
echo "Security Group ID: $SG_ID"

aws ec2 describe-security-groups --group-ids $SG_ID \
  --query 'SecurityGroups[0].IpPermissions[*].{Port:FromPort,Protocol:IpProtocol,Source:IpRanges[0].CidrIp}' \
  --output table

echo -e "\n=== Adding missing port 80 rule (if needed) ==="
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0 2>&1 | grep -v "already exists" || echo "Port 80 rule exists"

echo -e "\n=== Checking Network ACLs ==="
SUBNET_ID=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].SubnetId' --output text)
aws ec2 describe-network-acls --filters "Name=association.subnet-id,Values=$SUBNET_ID" \
  --query 'NetworkAcls[0].Entries[?Egress==`false`].[RuleNumber,Protocol,PortRange.From,PortRange.To,CidrBlock,RuleAction]' \
  --output table

echo -e "\n=== Testing connectivity ==="
PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
echo "Testing http://$PUBLIC_IP ..."
curl -I --connect-timeout 5 http://$PUBLIC_IP || echo "Connection failed"

echo -e "\n=== Recommendations ==="
echo "1. If Network ACL shows DENY rules, the default VPC ACL might need adjustment"
echo "2. Try accessing from http://$PUBLIC_IP in your browser"
echo "3. SSH to instance and verify: sudo docker ps && curl -I http://localhost"
