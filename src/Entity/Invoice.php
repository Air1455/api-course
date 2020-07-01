<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\InvoiceRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ApiResource(
 *     subresourceOperations={
 *      "api_customers_invoices_get_subresource"= {"normalization_context"={"groups"={"invoices_subresource"}}}
 *     },
 *     normalizationContext={"groups":"read:invoices"},
 *     denormalizationContext={"disable_type_enforcement"=true},
 *     attributes={
 *      "pagination_enabled"=true,
 *      "order": {"amount":"desc"}
 *     },
 *     itemOperations={
 *      "GET", "PUT", "DELETE",
 *      "increment"={
 *          "method"="post",
 *          "path"= "/invoices/{id}/increment",
 *          "controller"="App\Controller\InvoiceIncrementationController"
 *      }
 *     }
 * )
 * @ApiFilter(OrderFilter::class)
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"read:customer", "invoices_subresource", "read:invoices"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"read:customer", "invoices_subresource", "read:invoices"})
     * @Assert\NotBlank(message="Le montant est obligatoire")
     * @Assert\Type(type="numeric", message="Le montant doit être numérique")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"read:customer", "invoices_subresource", "read:invoices"})
     * @Assert\NotBlank(message="La date est obligatoire")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"read:customer", "invoices_subresource", "read:invoices"})
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"}, message="Le status doit être sent, paid ou cancelled")
     * @Assert\NotBlank(message="La date est obligatoire")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotBlank(message="Le client doit être renseigné")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"read:customer","invoices_subresource", "read:invoices"})
     * @Assert\NotBlank(message="Le chrono est obligatoire")
     * @Assert\Type(type="numeric", message="Le chrono doit être numérique")
     */
    private $chrono;

    /**
     * @return User
     * @Groups({"read:invoices","invoices_subresource"})
     */
    public function getUser() : User {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(\DateTimeInterface $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
